import AppointmentService from '../services/appointmentService.js';
import logger from '../utils/logger.js';

class AppointmentController {
  static async getMemberAppointments(req, res) {
    try {
      const { memberId } = req.params;
      const appointments = await AppointmentService.getMemberAppointments(memberId);
      
      logger.info(`Fetched appointments for member ${memberId}`);
      res.json({
        success: true,
        data: appointments
      });
    } catch (error) {
      logger.error(`Error fetching member appointments: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getSpecialistAppointments(req, res) {
    try {
      const { specialistId } = req.params;
      const { status, date } = req.query;
      const appointments = await AppointmentService.getSpecialistAppointments(specialistId, { status, date });
      
      logger.info(`Fetched appointments for specialist ${specialistId}`);
      res.json({
        success: true,
        data: appointments
      });
    } catch (error) {
      logger.error(`Error fetching specialist appointments: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async createAppointment(req, res) {
    try {
      const appointmentData = req.body;
      const userId = req.user.id;
      const newAppointment = await AppointmentService.createAppointment(appointmentData, userId);
      
      logger.info(`Created new appointment ${newAppointment.appointment_id}`);
      res.status(201).json({
        success: true,
        data: newAppointment
      });
    } catch (error) {
      logger.error(`Error creating appointment: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateAppointment(req, res) {
    try {
      const { appointmentId } = req.params;
      const updateData = req.body;
      const updatedAppointment = await AppointmentService.updateAppointment(appointmentId, updateData);
      
      logger.info(`Updated appointment ${appointmentId}`);
      res.json({
        success: true,
        data: updatedAppointment
      });
    } catch (error) {
      logger.error(`Error updating appointment: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateAppointmentStatus(req, res) {
    try {
      const { appointmentId } = req.params;
      const { status } = req.body;
      const updatedAppointment = await AppointmentService.updateStatus(appointmentId, status);
      
      logger.info(`Updated status for appointment ${appointmentId} to ${status}`);
      res.json({
        success: true,
        data: updatedAppointment
      });
    } catch (error) {
      logger.error(`Error updating appointment status: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteAppointment(req, res) {
    try {
      const { appointmentId } = req.params;
      await AppointmentService.deleteAppointment(appointmentId);
      
      logger.info(`Deleted appointment ${appointmentId}`);
      res.json({
        success: true,
        message: 'Appointment deleted successfully'
      });
    } catch (error) {
      logger.error(`Error deleting appointment: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getStatusCounts(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const counts = await AppointmentService.getStatusCounts(startDate, endDate);
      
      logger.info('Fetched appointment status counts');
      res.json({
        success: true,
        data: counts
      });
    } catch (error) {
      logger.error(`Error fetching status counts: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default AppointmentController;