import express from 'express';
import AuthController from '../controllers/authController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/send-otp', 
  // rateLimiter(5, 60), // 5 requests per minute
  AuthController.sendOTP
);

router.post('/verify-otp', 
  // rateLimiter(3, 60), // 3 requests per minute
  AuthController.verifyOTP
);

router.post('/login', 
  // rateLimiter(3, 60), // 3 requests per minute
  AuthController.loginWithPassword
);

router.get('/check-session', 
  AuthController.checkSession
);

export default router;