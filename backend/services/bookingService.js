import BookingModel from '../models/bookingModel.js';
import dayjs from 'dayjs';
import logger from '../utils/logger.js';

class BookingService {
  static async createOrUpdateBooking(bookingData) {
    try {
      const formattedData = this.formatBookingData(bookingData);

      // Determine if this is a new booking or update
      if (bookingData.actionType === 'Reschedule' || bookingData.actionType === 'Modify') {
        if (!bookingData.appointmentId) {
          throw new Error('Appointment ID is required for rescheduling');
        }
        return await BookingModel.updateBooking(bookingData.appointmentId, formattedData);
      } else {
        return await BookingModel.createBooking(formattedData);
      }
    } catch (error) {
      logger.error(`Booking service error: ${error.message}`);
      throw error;
    }
  }

  static formatBookingData(bookingData) {
    const isDirectBooking = [2, 4].includes(bookingData.specialistId);
    const formattedData = { ...bookingData };

    if (isDirectBooking && bookingData.selectedDate && bookingData.timeRange) {
      formattedData.confirmed_date = dayjs(bookingData.selectedDate).format('YYYY-MM-DD');
      formattedData.confirmed_time = dayjs(bookingData.timeRange.start).format('HH:mm');
    } else if (bookingData.selectedDates && bookingData.timeRanges) {
      // Format preferred dates
      formattedData.preferredDates = bookingData.selectedDates.map((date, index) => ({
        date: dayjs(date).format('YYYY-MM-DD'),
        timeRange: `${dayjs(bookingData.timeRanges[index].start).format('HH:mm')} to ${dayjs(bookingData.timeRanges[index].end).format('HH:mm')}`
      }));
    }

    return formattedData;
  }
}

export default BookingService;