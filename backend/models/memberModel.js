import pool from '../config/db.js';
import logger from '../utils/logger.js';

class MemberModel {
  static async findById(memberId) {
    try {
      const [member] = await pool.query(
        `SELECT member_id as id, email, name, cell as phoneNumber, role_id 
         FROM Members WHERE member_id = ?`,
        [memberId]
      );
      return member[0];
    } catch (error) {
      logger.error(`Error finding member: ${error.message}`);
      throw error;
    }
  }

  // Add other member-specific methods here
}

export default MemberModel;