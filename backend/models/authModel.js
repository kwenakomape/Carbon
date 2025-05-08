import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

class AuthModel {
  static generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  static async findMemberById(memberId) {
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

  static async findAdminByEmail(email) {
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

  static async getUserById(id, isMember) {
    try {
      if (isMember) {
        return this.findMemberById(id);
      }
      return this.findAdminByEmail(id);
    } catch (error) {
      logger.error(`Error getting user: ${error.message}`);
      throw error;
    }
  }

  static async hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

export default AuthModel;