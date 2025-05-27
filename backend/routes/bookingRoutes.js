import express from 'express';
import BookingController from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/',
//   rateLimiter(5, 60), // 5 requests per minute
//   authenticate,
  BookingController.createOrUpdateBooking
);

export default router;