import AdminService from '../services/adminService.js';
import logger from '../utils/logger.js';

class AdminController {
  static async updateAllAdminPasswords(req, res, next) {
    try {
      const { newPassword } = req.body;
      
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      const result = await AdminService.updateAllAdminPasswords(newPassword);
      
      logger.info(`Admin passwords updated by user ${req.user.id}`);
      res.json({
        success: true,
        message: `Updated ${result.affectedRows} admin passwords`,
        updatedCount: result.affectedRows
      });
    } catch (error) {
      logger.error(`Password update error: ${error.message}`);
      next(error);
    }
  }

  // Add other admin-related controller methods here
}

export default AdminController;