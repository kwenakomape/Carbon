import express from 'express';
import AppointmentController from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.patch(
  '/:appointmentId/status',
//   authenticate,
  AppointmentController.updateStatus
);

export default router;