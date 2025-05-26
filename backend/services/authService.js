import MemberModel from '../models/memberModel.js';
import AdminModel from '../models/adminModel.js';
import AuthModel from '../models/authModel.js';
import otpStorage from '../utils/otpStorage.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Constants
const OTP_EXPIRY_MS = 60 * 1000; // 1 minute in milliseconds

class AuthService {
  static async sendOTP(identifier) {
    const isNumericId = /^\d+$/.test(identifier);
    let user;

    try {
      // Validate identifier format
      if (!identifier || (typeof identifier !== 'string' && typeof identifier !== 'number')) {
        throw new Error('Please enter a valid member ID or email');
      }

      // Find user based on identifier type
      if (isNumericId) {
        user = await MemberModel.findById(identifier);
        if (!user) throw new Error("User not found. Please contact support.");
      } else {
        user = await AdminModel.findByEmail(identifier);
        if (!user) throw new Error("User not found. Please contact support.");
      }

      // Check for existing valid OTP
      const existingOtp = otpStorage.get(identifier);
      if (existingOtp && existingOtp.expiresAt > Date.now()) {
        logger.info(`Existing valid OTP found for ${identifier}`);
        return {
          success: true,
          message: "OTP already sent",
          phoneNumber: isNumericId ? user.phoneNumber : null,
          expiresAt: existingOtp.expiresAt
        };
      }

      // Generate new OTP
      const otp = AuthModel.generateOTP();
      const expiresAt = Date.now() + OTP_EXPIRY_MS;

      // Store OTP data
      otpStorage.set(identifier, {
        otp,
        expiresAt,
        userId: isNumericId ? user.id : identifier,
        roleId: user.role_id,
        isMember: isNumericId,
        attempts: 0 // Track verification attempts
      });

      logger.info(`OTP generated for ${identifier}: ${otp}`);
      
      // In production, you would send the OTP via SMS or email here
      // await sendOTPviaSMS(user.phoneNumber, otp);
      // or await sendOTPviaEmail(user.email, otp);

      return {
        success: true,
        message: "OTP sent successfully",
        phoneNumber: isNumericId ? user.phoneNumber : null,
        expiresAt
      };
    } catch (error) {
      logger.error(`OTP send error for ${identifier}: ${error.message}`);
      throw error;
    }
  }

  static async verifyOTP(identifier, otp) {
    try {
      // Basic validation
      if (!identifier || !otp) {
        throw new Error('Identifier and OTP are required');
      }

      // Retrieve stored OTP data
      const storedData = otpStorage.get(identifier);
      if (!storedData) {
        throw new Error("OTP expired or not requested");
      }

      // Check attempt limit (optional security measure)
      if (storedData.attempts >= 3) {
        otpStorage.delete(identifier);
        throw new Error("Too many attempts. Please request a new OTP");
      }

      // Increment attempt counter
      storedData.attempts++;
      otpStorage.set(identifier, storedData);

      // Verify OTP
      if (storedData.otp !== otp) {
        throw new Error("Invalid OTP");
      }

      // Check expiration
      if (storedData.expiresAt < Date.now()) {
        otpStorage.delete(identifier);
        throw new Error("OTP expired");
      }

      // Get user data
      let user;
      if (storedData.isMember) {
        user = await MemberModel.findById(storedData.userId);
      } else {
        user = await AdminModel.findByEmail(identifier);
      }

      if (!user) {
        throw new Error("User not found");
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          roleName: user.role_name,
          roleId: user.role_id,
          isMember: storedData.isMember,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Clean up OTP after successful verification
      otpStorage.delete(identifier);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.role_id,
          specialistType: user.specialist_type,
          isMember: storedData.isMember,
        },
        token,
      };
    } catch (error) {
      logger.error(`OTP verification failed for ${identifier}: ${error.message}`);
      throw error;
    }
  }

  static async loginWithPassword(email, password) {
    try {
      // Basic validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Find user by email
      const user = await AdminModel.findByEmail(email);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Verify password
      const isPasswordValid = await AuthModel.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Check for existing OTP
      const existingOtp = otpStorage.get(email);
      if (existingOtp && existingOtp.expiresAt > Date.now()) {
        logger.info(`Existing valid OTP found for admin ${email}`);
        return {
          requiresOtp: true,
          message: "OTP already sent",
          expiresAt: existingOtp.expiresAt
        };
      }

      // Generate new OTP for 2FA
      const otp = AuthModel.generateOTP();
      const expiresAt = Date.now() + OTP_EXPIRY_MS;

      // Store OTP data
      otpStorage.set(email, {
        otp,
        expiresAt,
        userId: user.id,
        roleId: user.role_id,
        isPasswordLogin: true,
        attempts: 0
      });

      logger.info(`OTP generated for admin ${email}: ${otp}`);
      
      // In production, you would send the OTP via email here
      // await sendOTPviaEmail(email, otp);

      return {
        requiresOtp: true,
        message: "OTP sent for verification",
        expiresAt
      };
    } catch (error) {
      logger.error(`Password login failed for ${email}: ${error.message}`);
      throw error;
    }
  }

  static async checkSession(token) {
    if (!token) return null;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Additional verification checks
      if (!decoded.id || !decoded.email) {
        throw new Error("Invalid token payload");
      }

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
        isMember: decoded.isMember,
      };
    } catch (error) {
      logger.error(`Session verification failed: ${error.message}`);
      return null;
    }
  }

  // Utility methods
  static generateTempToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  static generateToken(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload for token generation');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRES_IN || '1d' 
    });
  }

  static verifyToken(token) {
    if (!token) {
      throw new Error('No token provided');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

export default AuthService;