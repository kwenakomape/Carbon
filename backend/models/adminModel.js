import pool from '../config/db.js';
import logger from '../utils/logger.js';

class AdminModel {
  static async findByEmail(email) {
    try {
      const [admin] = await pool.query(
        `SELECT admin_id as id, email, name, password, role_id, specialist_type 
         FROM Admin WHERE email = ?`,
        [email]
      );
      return admin[0];
    } catch (error) {
      logger.error(`Error finding admin: ${error.message}`);
      throw error;
    }
  }

  static async updateAllPasswords(newHash) {
    try {
      const [result] = await pool.query(
        'UPDATE Admin SET password = ?, last_password_change = NOW()',
        [newHash]
      );
      logger.info(`Updated ${result.affectedRows} admin passwords`);
      return result;
    } catch (error) {
      logger.error(`Admin password update failed: ${error.message}`);
      throw error;
    }
  }

  // Add other admin-specific methods here
}

export default AdminModel;