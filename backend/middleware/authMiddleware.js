// File: middleware/authMiddleware.js
import { verifyToken } from '../utils/jwtUtils.js';
import logger from '../utils/logger.js';


export function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Authentication failed: ${error.message}`);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

export function authorize(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.roleName)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized access' 
      });
    }
    next();
  };
}