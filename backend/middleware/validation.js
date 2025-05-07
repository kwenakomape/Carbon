import { body, validationResult } from 'express-validator';

export const validateInput = (type) => {
  switch (type) {
    case 'sendOTP':
      return [
        body('identifier')
          .notEmpty().withMessage('Identifier is required')
          .trim()
      ];
    case 'verifyOTP':
      return [
        body('identifier').notEmpty().trim(),
        body('otp')
          .notEmpty().withMessage('OTP is required')
          .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
          .isNumeric().withMessage('OTP must be numeric')
      ];
    case 'login':
      return [
        body('email')
          .notEmpty().withMessage('Email is required')
          .isEmail().withMessage('Invalid email format'),
        body('password')
          .notEmpty().withMessage('Password is required')
          .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      ];
    default:
      return [];
  }
};

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};