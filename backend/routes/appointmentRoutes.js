import express from 'express';
import AppointmentController from '../controllers/appointmentController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Member routes
router.get(
  '/member/:memberId',
//   rateLimiter(10, 60),
//   authenticate,
  AppointmentController.getMemberAppointments
);

// Specialist routes
router.get(
  '/specialist/:specialistId',
  rateLimiter(10, 60),
//   authenticate,
//   authorize(['specialist', 'admin']),
  AppointmentController.getSpecialistAppointments
);

// CRUD operations
router.post(
  '/',
//   rateLimiter(5, 60),
//   authenticate,
  AppointmentController.createAppointment
);

router.put(
  '/:appointmentId',
//   rateLimiter(5, 60),
//   authenticate,
  AppointmentController.updateAppointment
);

router.patch(
  '/:appointmentId/status',
//   rateLimiter(5, 60),
//   authenticate,
  AppointmentController.updateAppointmentStatus
);

router.delete(
  '/:appointmentId',
  rateLimiter(5, 60),
//   authenticate,
//   authorize(['admin']),
  AppointmentController.deleteAppointment
);

// Admin reporting
router.get(
  '/analytics/status-counts',
  rateLimiter(5, 60),
//   authenticate,
//   authorize(['admin']),
  AppointmentController.getStatusCounts
);

export default router;