import AuthModel from '../models/authModel.js';
import dayjs from 'dayjs';
import crypto from 'crypto';

// In-memory storage for OTPs (use Redis in production)
const otpStorage = new Map();

class AuthController {
  static async sendOTP(req, res) {
    try {
      const { identifier } = req.body;
      const isNumericId = /^\d+$/.test(identifier);

      let user;
      if (isNumericId) {
        user = await AuthModel.findMemberById(identifier);
      } else {
        user = await AuthModel.findAdminByEmail(identifier);
      }

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Check for existing valid OTP
      const existingOtp = otpStorage.get(identifier);
      if (existingOtp && dayjs(existingOtp.expiresAt).isAfter(dayjs())) {
        return res.json({
          success: true,
          message: 'OTP already sent',
          phoneNumber: isNumericId ? user.phoneNumber : null
        });
      }

      const otp = AuthModel.generateOTP();
      const expiresAt = dayjs().add(10, 'minute').toDate();

      otpStorage.set(identifier, {
        otp,
        expiresAt,
        userId: user.id,
        roleId: user.role_id,
        isMember: isNumericId
      });

      console.log(`OTP for ${identifier}: ${otp}`); // In production, send via SMS/email

      res.json({
        success: true,
        message: 'OTP sent successfully',
        phoneNumber: isNumericId ? user.phoneNumber : null
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
  }

  static async verifyOTP(req, res) {
    try {
      const { identifier, otp } = req.body;
      const storedData = otpStorage.get(identifier);

      if (!storedData) {
        return res.status(400).json({ success: false, message: 'OTP expired or not requested' });
      }

      if (storedData.otp !== otp || dayjs(storedData.expiresAt).isBefore(dayjs())) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }

      const user = await AuthModel.getUserById(storedData.userId, storedData.isMember);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      otpStorage.delete(identifier);

      res.json({
        success: true,
        message: 'OTP verified successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.role_id,
          specialistType: user.specialist_type || null,
          isMember: storedData.isMember
        }
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
  }

  static async loginWithPassword(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AuthModel.verifyAdminCredentials(email, password);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const tempToken = crypto.randomBytes(32).toString('hex');
      
      // Check for existing OTP
      const existingOtp = otpStorage.get(email);
      if (existingOtp && dayjs(existingOtp.expiresAt).isAfter(dayjs())) {
        return res.json({
          success: true,
          message: 'OTP already sent',
          tempToken,
          requiresOtp: true
        });
      }

      const otp = AuthModel.generateOTP();
      const expiresAt = dayjs().add(10, 'minute').toDate();

      otpStorage.set(email, {
        otp,
        expiresAt,
        userId: user.id,
        roleId: user.role_id,
        isPasswordLogin: true
      });

      console.log(`OTP for ${email}: ${otp}`); // In production, send via email

      res.json({
        success: true,
        message: 'OTP sent for verification',
        tempToken,
        requiresOtp: true
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'Login failed' });
    }
  }

  static async checkSession(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      // In production: Verify JWT token and fetch user from DB
      // This is a simplified version for demo purposes
      res.json({
        success: true,
        user: {
          id: 1,
          name: "Demo User",
          email: "demo@example.com",
          roleId: 1
        }
      });
    } catch (error) {
      console.error('Error checking session:', error);
      res.status(401).json({ success: false, message: 'Invalid session' });
    }
  }
}

export default AuthController;