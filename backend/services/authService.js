import AuthModel from '../models/authModel.js';
import otpStorage  from '../utils/otpStorage.js';
import crypto from 'crypto';
import { 
  verifyAdminPassword,
  getDefaultAdminPasswordHash
} from '../utils/passwordUtils.js';
import { generateToken, verifyToken } from '../utils/jwtUtils.js';
import logger from '../utils/logger.js';


class AuthService {
  static async sendOTP(identifier) {
    const isNumericId = /^\d+$/.test(identifier);
    let user;

    if (isNumericId) {
      // Member login - verify member exists
      user = await AuthModel.findMemberById(identifier);
      if (!user) {
        throw new Error('Member not found');
      }
    } else {
      // Admin login - verify email exists
      user = await AuthModel.findAdminByEmail(identifier);
      if (!user) {
        throw new Error('Admin not found');
      }
    }

    // Check for existing valid OTP
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
      userId: user.id,
      roleId: user.role_id,
      isMember: isNumericId
    });

    logger.info(`OTP generated for ${identifier}`);
    logger.info(otp);
    // In production: Implement actual SMS/email sending here

    return {
      success: true,
      message: 'OTP sent successfully',
      phoneNumber: isNumericId ? user.phoneNumber : null
    };
  }

  static async verifyOTP(identifier, otp) {
    const storedData = otpStorage.get(identifier);
    //console.log(JSON.stringify(storedData, null, 2));
    //console.log(`teh storedData is ${storedData}`)
    if (!storedData) {
      throw new Error('OTP expired or not requested');
    }

    if (storedData.otp !== otp || storedData.expiresAt < Date.now()) {
      throw new Error('Invalid or expired OTP');
    }

    const user = await AuthModel.getUserById(
      storedData.userId, 
      storedData.isMember
    );
    // console.log()
    //console.log(`the user data is ${JSON.stringify(user, null, 2)}`)
    if (!user) {
      throw new Error('User not found');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      roleId: user.role_id,
      isMember: storedData.isMember
    });

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
  }

  static async loginWithPassword(email, password) {
    const user = await AuthModel.findAdminByEmail(email);
    
    if (!user) {
      throw new Error('Admin not found');
    }

    // Verify admin password
    const isPasswordValid = await verifyAdminPassword(password, user.password);
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

    logger.info(`OTP generated for admin ${email}`);
    // In production: Send OTP via email

    return {
      requiresOtp: true,
      tempToken: this.generateTempToken(),
      message: 'OTP sent for verification'
    };
  }

  static async checkSession(token) {
    if (!token) return null;
    
    try {
      const decoded = verifyToken(token);
      const user = await AuthModel.getUserById(decoded.id, decoded.isMember);
      
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

  static generateTempToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // For initial admin setup
  static getDefaultAdminPassword() {
    return getDefaultAdminPasswordHash();
  }
}

export default AuthService;
