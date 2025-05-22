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
        if (!user) throw new Error("Please enter a valid member ID or email");
      } else {
        user = await AdminModel.findByEmail(identifier);
        if (!user) throw new Error("Please enter a valid member ID or email");
      }

      const existingOtp = otpStorage.get(identifier);
      if (existingOtp && existingOtp.expiresAt > Date.now()) {
        logger.debug(`Existing OTP found for ${identifier}`);
        return {
          success: true,
          message: "OTP already sent",
          phoneNumber: isNumericId ? user.phoneNumber : null,
          // [+] Add expiresAt to help frontend show countdown
          expiresAt: existingOtp.expiresAt 
        };
      }

      const otp = AuthModel.generateOTP();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      otpStorage.set(identifier, {
        otp,
        expiresAt,
        userId: isNumericId ? user.id : identifier,
        roleId: user.role_id,
        isMember: isNumericId,
      });

      logger.info(`OTP generated for ${identifier} : ${otp}`); // 
      return {
        success: true,
        message: "OTP sent successfully",
        phoneNumber: isNumericId ? user.phoneNumber : null,
        // [+] Add expiresAt
        expiresAt 
      };
    } catch (error) {
      logger.error(`OTP send error for ${identifier}: ${error.message}`);
      throw error;
    }
  }

  static async verifyOTP(identifier, otp) {
    try {
      const storedData = otpStorage.get(identifier);
      if (!storedData) throw new Error("OTP expired or not requested");
      if (storedData.otp !== otp) {
        throw new Error("Invalid OTP");
      }
      if (storedData.expiresAt < Date.now()) {
        throw new Error("OTP expired");
      }

      let user;
      if (storedData.isMember) {
        user = await MemberModel.findById(storedData.userId);
      } else {
        user = await AdminModel.findByEmail(identifier);
      }

      if (!user) throw new Error("User not found");

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
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const user = await AdminModel.findByEmail(email);
      if (!user) {
        throw new Error("Invalid credentials. Please check your email and password.");
      }

      const isPasswordValid = await AuthModel.comparePassword(
        password,
        user.password
      );
      
      if (!isPasswordValid) {
        throw new Error("Invalid credentials. Please check your email and password.");
      }

      const existingOtp = otpStorage.get(email);
      if (existingOtp && existingOtp.expiresAt > Date.now()) {
        logger.debug(`Existing OTP found for admin ${email}`);
        return {
          requiresOtp: true,
          message: "OTP already sent",
          expiresAt: existingOtp.expiresAt // [+] Add expiresAt
        };
      }

      const otp = AuthModel.generateOTP();
      const expiresAt = Date.now() + 10 * 60 * 1000;

      otpStorage.set(email, {
        otp,
        expiresAt,
        userId: user.id,
        roleId: user.role_id,
        isPasswordLogin: true,
      });

      logger.info(`OTP generated for admin ${email} ${otp}`);
      return {
        requiresOtp: true,
        message: "OTP sent for verification",
        expiresAt // [+] Add expiresAt
      };
    } catch (error) {
      logger.error(`Password login failed for ${email}: ${error.message}`);
      throw error;
    }
  }

  static async checkSession(token) {
    if (!token) return null;

    try {
      const decoded = this.verifyToken(token);
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

  static generateTempToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  // [+] Moved to class methods for better organization
  static generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRES_IN || '1d' 
    });
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

export default AuthService;