import pool from '../config/db.js';
import logger from '../utils/logger.js';

class BookingModel {
  static async createBooking(bookingData) {
    try {
      let query;
      let values;

      if (bookingData.confirmed_date) {
        // Direct booking (specialistId 2 or 4)
        query = `
          INSERT INTO Appointments 
          (member_id, specialist_id, status, confirmed_date, confirmed_time, specialist_name, booking_type, notes_status, booked_by, initiator_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        values = [
          bookingData.memberId,
          bookingData.specialistId,
          'confirmed',
          bookingData.confirmed_date,
          bookingData.confirmed_time,
          bookingData.specialistName,
          bookingData.booking_type,
          bookingData.notes_status,
          bookingData.booked_by,
          bookingData.initiator_id
        ];
      } else {
        // Preferred time slots booking
        query = `
          INSERT INTO Appointments 
          (member_id, specialist_id, status, preferred_date1, preferred_time_range1, preferred_date2, preferred_time_range2, preferred_date3, preferred_time_range3, booking_type, notes_status, booked_by, initiator_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        values = [
          bookingData.memberId,
          bookingData.specialistId,
          bookingData.status || 'pending',
          bookingData.preferredDates[0].date,
          bookingData.preferredDates[0].timeRange,
          bookingData.preferredDates[1].date,
          bookingData.preferredDates[1].timeRange,
          bookingData.preferredDates[2].date,
          bookingData.preferredDates[2].timeRange,
          bookingData.booking_type,
          bookingData.notes_status,
          bookingData.booked_by,
          bookingData.initiator_id
        ];
      }

      const [result] = await pool.query(query, values);
      return { appointmentId: result.insertId };
    } catch (error) {
      logger.error(`Database error creating booking: ${error.message}`);
      throw new Error('Failed to create booking');
    }
  }

  static async updateBooking(appointmentId, bookingData) {
    try {
      let query;
      let values;

      if (bookingData.confirmed_date) {
        // Reschedule direct booking
        query = `
          UPDATE Appointments
          SET confirmed_date = ?, confirmed_time = ?
          WHERE appointment_id = ? AND member_id = ?
        `;
        values = [
          bookingData.confirmed_date,
          bookingData.confirmed_time,
          appointmentId,
          bookingData.memberId
        ];
      } else {
        // Update preferred time slots
        query = `
          UPDATE Appointments
          SET status = ?, 
              preferred_date1 = ?, 
              preferred_time_range1 = ?, 
              preferred_date2 = ?, 
              preferred_time_range2 = ?, 
              preferred_date3 = ?, 
              preferred_time_range3 = ?,
              confirmed_date = NULL, 
              confirmed_time = NULL
          WHERE appointment_id = ? AND member_id = ?
        `;
        values = [
          bookingData.status || 'pending',
          bookingData.preferredDates[0].date,
          bookingData.preferredDates[0].timeRange,
          bookingData.preferredDates[1].date,
          bookingData.preferredDates[1].timeRange,
          bookingData.preferredDates[2].date,
          bookingData.preferredDates[2].timeRange,
          appointmentId,
          bookingData.memberId
        ];
      }

      const [result] = await pool.query(query, values);
      if (result.affectedRows === 0) {
        throw new Error('No appointment found to update');
      }
      return { appointmentId };
    } catch (error) {
      logger.error(`Database error updating booking: ${error.message}`);
      throw new Error('Failed to update booking');
    }
  }
}

export default BookingModel;