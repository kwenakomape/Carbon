import pool from '../config/db.js';
import logger from '../utils/logger.js';

class AppointmentModel {
  static async updateStatus(appointmentId, status, userId, isMember) {
    try {
      let query;
      let params;

      if (isMember) {
        // Member can only cancel their own appointments
        if (status !== 'Cancelled') {
          throw { message: 'Members can only cancel appointments', statusCode: 403 };
        }

        query = `
          UPDATE Appointments 
          SET status = ?
          WHERE appointment_id = ? AND member_id = ?
          RETURNING *`;
        params = [status, appointmentId, userId];
      } else {
        // Admin can update to any status
        query = `
          UPDATE Appointments 
          SET status = ?
          WHERE appointment_id = ?
          RETURNING *`;
        params = [status, appointmentId];
      }

      const [result] = await pool.query(query, params);
      return result[0];
    } catch (error) {
      logger.error(`Database error updating status: ${error.message}`);
      throw error;
    }
  }
}

export default AppointmentModel;