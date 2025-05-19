// File: controllers/authController.js
import AuthService from '../services/authService.js';
import logger from '../utils/logger.js';

class AuthController {
  static async sendOTP(req, res, next) {
    try {
      const { identifier } = req.body;
      const result = await AuthService.sendOTP(identifier);
      
      logger.info(`OTP sent to ${identifier}`);
      res.json(result);
    } catch (error) {
      logger.error(`OTP send error: ${error.message}`);
      next(error);
    }
  }

  static async verifyOTP(req, res, next) {
    try {
      const { identifier, otp } = req.body;
      const { user, token } = await AuthService.verifyOTP(identifier, otp);
      
      logger.info(`User ${user.id} verified successfully`);
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.role_id,
          specialistType: user.specialist_type,
          isMember: user.isMember
        }
      });
    } catch (error) {
      logger.error(`OTP verification error: ${error.message}`);
      next(error);
    }
  }

  static async loginWithPassword(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginWithPassword(email, password);
      
      logger.info(`Password login initiated for ${email}`);
      res.json(result);
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      next(error);
    }
  }

  static async checkSession(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const user = await AuthService.checkSession(token);
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid session' });
      }

      logger.info(`Session checked for user ${user.id}`);
      res.json({ success: true, user });
    } catch (error) {
      logger.error(`Session check error: ${error.message}`);
      next(error);
    }
  }
}

export default AuthController;