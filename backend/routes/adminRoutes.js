import express from 'express';
import AdminController from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/update-passwords', 
  // authenticate,
  // authorize(['IT Manager']),
  AdminController.updateAllAdminPasswords
);

export default router;