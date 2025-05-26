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
  static async getMemberWithAppointments(memberId) {
    const query = `
      SELECT 
        m.member_id,
        m.email,
        m.name AS member_name,
        m.cell,
        m.joined_date,
        m.credits,
        m.role_id,
        a.appointment_id,
        a.request_date,
        a.confirmed_date,
        a.confirmed_time,
        a.status,
        a.credits_used,
        a.specialist_id,
        a.invoice_status,
        a.payment_method,
        a.payment_status,
        a.specialist_name,
        a.preferred_date1,
        a.preferred_time_range1,
        a.preferred_date2,
        a.preferred_time_range2,
        a.preferred_date3,
        a.preferred_time_range3,
        a.booking_type,
        a.notes_status,
        a.booked_by,
        ad.specialist_type
      FROM Members m
      LEFT JOIN Appointments a ON m.member_id = a.member_id
      LEFT JOIN Admin ad ON a.specialist_id = ad.admin_id
      WHERE m.member_id = ?
      ORDER BY a.request_date DESC`;
    
    try {
      const [results] = await pool.query(query, [memberId]);
      return results;
    } catch (error) {
      logger.error(`Database error fetching member: ${error.message}`);
      throw new Error('Failed to fetch member data');
    }
  }

  // Add other member-specific methods here
}

export default MemberModel;