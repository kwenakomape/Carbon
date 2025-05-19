
import MemberModel from '../models/MemberModel.js';
import logger from '../utils/logger.js';

class MemberService {
  static async getMemberById(memberId) {
    try {
      return await MemberModel.findById(memberId);
    } catch (error) {
      logger.error(`Member service error: ${error.message}`);
      throw error;
    }
  }

  // Future service methods
}

export default MemberService;