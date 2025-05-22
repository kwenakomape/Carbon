import AuthService from '../services/authService.js';
import logger from '../utils/logger.js';

class AuthController {
  static async sendOTP(req, res) {
    try {
      const { identifier } = req.body;
      
      if (!identifier) {
        return res.status(400).json({
          success: false,
          message: 'Identifier (member ID or email) is required'
        });
      }

      const result = await AuthService.sendOTP(identifier);
      
      logger.info(`OTP sent to ${identifier}`);
      res.json({
        success: true,
        message: result.message,
        phoneNumber: result.phoneNumber
      });
    } catch (error) {
      logger.error(`OTP send error: ${error.message}`);
      
      // Preserve the specific error message from AuthService
      res.status(400).json({
        success: false,
        message: error.message // "Please enter a valid member ID or email" or other specific error
      });
    }
  }

  static async verifyOTP(req, res) {
    try {
      const { identifier, otp } = req.body;
      
      if (!identifier || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Identifier and OTP are required'
        });
      }

      const { user, token } = await AuthService.verifyOTP(identifier, otp);
      
      logger.info(`User ${user.id} verified successfully`);
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId,
          specialistType: user.specialistType,
          isMember: user.isMember
        }
      });
    } catch (error) {
      logger.error(`OTP verification error: ${error.message}`);
      
      res.status(400).json({
        success: false,
        message: error.message // "Invalid or expired OTP" or other specific error
      });
    }
  }

  static async loginWithPassword(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await AuthService.loginWithPassword(email, password);
      
      logger.info(`Password login initiated for ${email}`);
      res.json({
        success: true,
        requiresOtp: result.requiresOtp,
        message: result.message
      });
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      
      // Use status 401 for authentication failures
      res.status(401).json({
        success: false,
        message: error.message // "Invalid credentials. Please check your email and password."
      });
    }
  }

  static async checkSession(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'No authorization token provided' 
        });
      }

      const user = await AuthService.checkSession(token);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid or expired session' 
        });
      }

      logger.info(`Session checked for user ${user.id}`);
      res.json({ 
        success: true, 
        user 
      });
    } catch (error) {
      logger.error(`Session check error: ${error.message}`);
      
      res.status(401).json({
        success: false,
        message: 'Session verification failed'
      });
    }
  }
}

export default AuthController;