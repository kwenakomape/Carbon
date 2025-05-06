import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', AuthController.sendOTP);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/login', AuthController.loginWithPassword);
router.get('/check-session', AuthController.checkSession);

export default router;