import MemberModel from '../models/memberModel.js';
import logger from '../utils/logger.js';

class MemberService {
  static async getMemberWithAppointments(memberId) {
    try {
      // Validate memberId
      if (!memberId || isNaN(memberId)) {
        throw new Error('Invalid member ID');
      }

      const memberData = await MemberModel.getMemberWithAppointments(memberId);
      
      if (!memberData || memberData.length === 0) {
        throw { 
          message: 'Member not found', 
          statusCode: 404 
        };
      }

      return this.transformMemberData(memberData);
    } catch (error) {
      logger.error(`Service error fetching member data: ${error.message}`);
      throw error;
    }
  }

  static transformMemberData(rawData) {
    if (!rawData || rawData.length === 0) return null;
    
    const member = {
      member_id: rawData[0].member_id,
      name: rawData[0].member_name,
      email: rawData[0].email,
      cell: rawData[0].cell,
      joined_date: rawData[0].joined_date,
      credits: rawData[0].credits,
      role_id: rawData[0].role_id,
      appointments: []
    };

    // Only add appointments if request_date exists
    if (rawData[0].request_date) {
      member.appointments = rawData.map(app => ({
        appointment_id: app.appointment_id,
        request_date: app.request_date,
        confirmed_date: app.confirmed_date,
        confirmed_time: app.confirmed_time,
        status: app.status,
        credits_used: app.credits_used,
        specialist_id: app.specialist_id,
        invoice_status: app.invoice_status,
        payment_method: app.payment_method,
        payment_status: app.payment_status,
        specialist_name: app.specialist_name,
        preferred_date1: app.preferred_date1,
        preferred_time_range1: app.preferred_time_range1,
        preferred_date2: app.preferred_date2,
        preferred_time_range2: app.preferred_time_range2,
        preferred_date3: app.preferred_date3,
        preferred_time_range3: app.preferred_time_range3,
        booking_type: app.booking_type,
        notes_status: app.notes_status,
        booked_by: app.booked_by,
        specialist_type: app.specialist_type
      }));
    }

    return member;
  }
}

export default MemberService;