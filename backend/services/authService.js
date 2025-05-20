import MemberModel from '../models/memberModel.js';
import AdminModel from '../models/adminModel.js';
import AuthModel from '../models/authModel.js';
import otpStorage from '../utils/otpStorage.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

class AuthService {
  static async sendOTP(identifier) {
    const isNumericId = /^\d+$/.test(identifier);
    let user;

    try {
      if (isNumericId) {
        user = await MemberModel.findById(identifier);
        if (!user) throw new Error('Member not found');
      } else {
        user = await AdminModel.findByEmail(identifier);
        if (!user) throw new Error('Admin not found');
      }

      const existingOtp = otpStorage.get(identifier);
      if (existingOtp && existingOtp.expiresAt > Date.now()) {
        logger.debug(`Existing OTP found for ${identifier}`);
        return {
          success: true,
          message: 'OTP already sent',
          phoneNumber: isNumericId ? user.phoneNumber : null
        };
      }

      const otp = AuthModel.generateOTP();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      otpStorage.set(identifier, {
        otp,
        expiresAt,
        userId: isNumericId ? user.id : identifier, // Store ID or email
        roleId: user.role_id,
        isMember: isNumericId
      });

      logger.info(`OTP generated for ${identifier}: ${otp}`);
      return {
        success: true,
        message: 'OTP sent successfully',
        phoneNumber: isNumericId ? user.phoneNumber : null
      };
    } catch (error) {
      logger.error(`OTP send error for ${identifier}: ${error.message}`);
      throw error;
    }
  }

  static async verifyOTP(identifier, otp) {
    try {
      const storedData = otpStorage.get(identifier);
      if (!storedData) throw new Error('OTP expired or not requested');
      if (storedData.otp !== otp || storedData.expiresAt < Date.now()) {
        throw new Error('Invalid or expired OTP');
      }

      let user;
      if (storedData.isMember) {
        user = await MemberModel.findById(storedData.userId);
      } else {
        user = await AdminModel.findByEmail(identifier); // Use original identifier (email)
      }

      if (!user) throw new Error('User not found');

      const token = jwt.sign({
        id: user.id,
        email: user.email,
        roleName: user.role_name,
        roleId: user.role_id,
        isMember: storedData.isMember
      }, process.env.JWT_SECRET, { expiresIn: '1d' });

      otpStorage.delete(identifier);
      
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.role_id,
          specialistType: user.specialist_type,
          isMember: storedData.isMember
        },
        token
      };
    } catch (error) {
      logger.error(`OTP verification failed for ${identifier}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Authenticate admin with password
   * @param {string} email - Admin email
   * @param {string} password - Plain text password
   * @returns {Promise<object>} - Authentication result
   */
  static async loginWithPassword(email, password) {
    try {
      const user = await AdminModel.findByEmail(email);
      if (!user) {
        throw new Error('Admin not found');
      }

      // Verify password
      const isPasswordValid = await AuthModel.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Check for existing OTP
      const existingOtp = otpStorage.get(email);
      if (existingOtp && existingOtp.expiresAt > Date.now()) {
        logger.debug(`Existing OTP found for admin ${email}`);
        return {
          requiresOtp: true,
          tempToken: this.generateTempToken(),
          message: 'OTP already sent'
        };
      }

      // Generate new OTP for admin
      const otp = AuthModel.generateOTP();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      otpStorage.set(email, {
        otp,
        expiresAt,
        userId: user.id,
        roleId: user.role_id,
        isPasswordLogin: true
      });
      //  console.log(otpStorage);
      logger.info(`OTP generated for admin ${email}: ${otp}`);
      // In production: Send OTP via email

      return {
        requiresOtp: true,
        tempToken: this.generateTempToken(),
        message: 'OTP sent for verification'
      };
    } catch (error) {
      logger.error(`Password login failed for ${email}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate existing session token
   * @param {string} token - JWT token
   * @returns {Promise<object|null>} - User data if valid
   */
  static async checkSession(token) {
    if (!token) return null;
    
    try {
      const decoded = verifyToken(token);
      const user = decoded.isMember
        ? await MemberModel.findById(decoded.id)
        : await AdminModel.findByEmail(decoded.id);
      
      if (!user) {
        logger.warn(`User not found for token ${token}`);
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.role_id,
        specialistType: user.specialist_type,
        isMember: decoded.isMember
      };
    } catch (error) {
      logger.error(`Session verification failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Generate temporary token for OTP flow
   * @returns {string} - Random token
   */
  static generateTempToken() {
    return crypto.randomBytes(32).toString('hex');
  }
}

// Local utility functions (could move to separate file if reused)
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '1d' 
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export default AuthService;
