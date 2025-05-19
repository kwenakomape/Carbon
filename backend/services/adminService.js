// File: services/adminService.js
import AdminModel from '../models/adminModel.js';
import AuthModel from '../models/authModel.js';
import logger from '../utils/logger.js';

class AdminService {
  static async updateAllAdminPasswords(newPassword) {
    try {
      const hashedPassword = await AuthModel.hashPassword(newPassword);
      return await AdminModel.updateAllPasswords(hashedPassword);
    } catch (error) {
      logger.error(`Admin password update failed: ${error.message}`);
      throw error;
    }
  }
}

export default AdminService;