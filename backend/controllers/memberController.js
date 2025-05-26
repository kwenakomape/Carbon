import MemberService from '../services/memberService.js';
import logger from '../utils/logger.js';

class MemberController {
  static async getMemberWithAppointments(req, res) {
    try {
      const { memberId } = req.params;
      const memberData = await MemberService.getMemberWithAppointments(memberId);
      
      logger.info(`Fetched member data for ${memberId}`);
      res.json({
        success: true,
        data: memberData
      });
    } catch (error) {
      logger.error(`Error fetching member data: ${error.message}`);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default MemberController;