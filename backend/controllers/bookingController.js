import BookingService from '../services/bookingService.js';
import logger from '../utils/logger.js';

class BookingController {
  static async createOrUpdateBooking(req, res) {
    try {
      const bookingData = req.body;

      const result = await BookingService.createOrUpdateBooking(bookingData);
      
      logger.info(`Booking ${bookingData.actionType || 'created'} successfully`, {
        appointmentId: result.appointmentId,
        memberId: bookingData.memberId,
        specialistId: bookingData.specialistId
      });

      res.json({
        success: true,
        message: `Appointment ${bookingData.actionType || 'booked'} successfully`,
        data: result
      });
    } catch (error) {
      logger.error('Booking error:', error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default BookingController;