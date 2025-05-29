import AppointmentModel from '../models/appointmentModel.js';
import logger from '../utils/logger.js';

class AppointmentService {
  static async updateStatus(appointmentId, status, userId, isMember) {
    try {
      // Validate status
      const validStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Seen', 'Rescheduled', 'Missed'];
      if (!validStatuses.includes(status)) {
        throw { message: 'Invalid status', statusCode: 400 };
      }

      // Check permissions and update
      const updatedAppointment = await AppointmentModel.updateStatus(
        appointmentId,
        status,
        userId,
        isMember
      );

      if (!updatedAppointment) {
        throw { message: 'Appointment not found or unauthorized', statusCode: 404 };
      }

      return updatedAppointment;
    } catch (error) {
      logger.error(`AppointmentService update error: ${error.message}`);
      throw error;
    }
  }
}

export default AppointmentService;