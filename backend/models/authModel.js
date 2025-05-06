import pool from '../config/db.js';
import dayjs from 'dayjs';
import crypto from 'crypto';

class AuthModel {
  // Generate random 6-digit OTP
  static generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  static async findMemberById(memberId) {
    const [member] = await pool.query(
      'SELECT member_id as id, email, name, cell as phoneNumber, role_id FROM Members WHERE member_id = ?',
      [memberId]
    );
    return member[0];
  }

  static async findAdminByEmail(email) {
    const [admin] = await pool.query(
      'SELECT admin_id as id, email, name, role_id, specialist_type FROM Admin WHERE email = ?',
      [email]
    );
    return admin[0];
  }

  static async verifyAdminCredentials(email, password) {
    const [admin] = await pool.query(
      'SELECT admin_id as id, email, name, role_id, specialist_type FROM Admin WHERE email = ? AND password = ?',
      [email, password]
    );
    return admin[0];
  }

  static async getUserById(id, isMember) {
    if (isMember) {
      return this.findMemberById(id);
    }
    return this.findAdminByEmail(id);
  }
}

export default AuthModel;