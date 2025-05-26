import express from 'express';
import MemberController from '../controllers/memberController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get(
  '/:memberId',
//   rateLimiter(10, 60), // 10 requests per minute
//   authenticate,
  MemberController.getMemberWithAppointments
);

export default router;