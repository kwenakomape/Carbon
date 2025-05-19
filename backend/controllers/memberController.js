// File: controllers/memberController.js
import MemberService from '../services/memberService.js';
import logger from '../utils/logger.js';

class MemberController {
  static async getMemberProfile(req, res, next) {
    try {
      const { memberId } = req.params;
      const member = await MemberService.getMemberById(memberId);
      
      if (!member) {
        return res.status(404).json({
          success: false,
          message: 'Member not found'
        });
      }

      logger.info(`Retrieved profile for member ${memberId}`);
      res.json({
        success: true,
        data: {
          id: member.id,
          name: member.name,
          email: member.email,
          phoneNumber: member.phoneNumber,
          credits: member.credits
          // Exclude sensitive data
        }
      });
    } catch (error) {
      logger.error(`Member profile error: ${error.message}`);
      next(error);
    }
  }

  // Future methods can go here
  // updateMemberProfile, etc.
}

export default MemberController;