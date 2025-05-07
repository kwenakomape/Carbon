import express from 'express';
import AuthController from '../controllers/authController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { validateInput } from '../middleware/validation.js';

const router = express.Router();

router.post('/send-otp', 
  rateLimiter(5, 60), // 5 requests per minute
  validateInput('sendOTP'),
  AuthController.sendOTP
);

router.post('/verify-otp', 
  rateLimiter(3, 60), // 3 requests per minute
  validateInput('verifyOTP'),
  AuthController.verifyOTP
);

router.post('/login', 
  rateLimiter(3, 60), // 3 requests per minute
  validateInput('login'),
  AuthController.loginWithPassword
);

router.get('/check-session', 
  AuthController.checkSession
);

export default router;