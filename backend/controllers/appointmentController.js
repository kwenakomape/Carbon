import AppointmentService from '../services/appointmentService.js';
import logger from '../utils/logger.js';

class AppointmentController {
  static async updateStatus(req, res) {
    try {
      const { appointmentId } = req.params;
      const { status } = req.body;
      const { id: userId, isMember } = req.user;

      const result = await AppointmentService.updateStatus(
        appointmentId,
        status,
        userId,
        isMember
      );

      res.json({
        success: true,
        message: 'Appointment status updated successfully',
        data: result
      });
    } catch (error) {
      logger.error(`Status update error: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default AppointmentController;