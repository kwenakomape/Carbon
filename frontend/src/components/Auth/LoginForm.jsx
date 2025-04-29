import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OtpInput } from './OtpInput';
import { sendSmsOtp, verifyOtp, loginWithPassword } from '../../../../backend/services/authService';

// Define variants outside the component for better organization
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
      duration: 0.6
    }
  }
};

const hoverEffect = {
  scale: 1.02,
  transition: { type: 'spring', stiffness: 400, damping: 10 }
};

const tapEffect = { scale: 0.98 };

export const LoginForm = ({ navigate }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [isMemberLogin, setIsMemberLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const isEmail = (input) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  const handleIdentifierSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isEmail(identifier)) {
        // Specialist/Admin login - show password field
        setShowPasswordField(true);
        setIsMemberLogin(false);
      } else {
        // Member login - send OTP
        await sendSmsOtp(identifier);
        setOtpSent(true);
        setIsMemberLogin(true);
        setShowOtpField(true);
        setCountdown(60); // 1 minute countdown
      }
    } catch (err) {
      setError(err.message || 'Failed to initiate login');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginWithPassword(identifier, password);
      // For specialists/admins, send OTP after password verification
      await sendSmsOtp(identifier);
      setOtpSent(true);
      setShowOtpField(true);
      setCountdown(60);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (otp) => {
    setIsLoading(true);
    setError('');
    
    try {
      await verifyOtp(identifier, otp, isMemberLogin);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await sendSmsOtp(identifier);
      setCountdown(60);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4 sm:space-y-6"
    >
      <motion.div 
        variants={itemVariants}
        className="flex flex-col items-center mb-6 sm:mb-8"
      >
        <motion.svg 
          className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" 
          viewBox="0 0 24 24" 
          fill="none"
          whileHover={{ rotate: 10, transition: { type: 'spring', stiffness: 300 } }}
        >
          <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
        <motion.h1 
          className="mt-2 sm:mt-4 text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white"
          whileHover={{ scale: 1.02 }}
        >
          Carbon Access
        </motion.h1>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3">
        <motion.h2 
          className="text-xl sm:text-2xl font-semibold text-center text-gray-700 dark:text-gray-200"
          whileHover={{ scale: 1.01 }}
        >
          {showOtpField ? 'Verify Your Identity' : 'Manage Your Clinical Credits'}
        </motion.h2>
        <motion.p 
          className="text-sm sm:text-base text-center text-gray-500 dark:text-gray-400"
          whileHover={{ scale: 1.01 }}
        >
          {showOtpField 
            ? `Enter the OTP sent to your registered phone number` 
            : 'Sign in to book services or check your credit balance'}
        </motion.p>
      </motion.div>

      {error && (
        <motion.div 
          variants={itemVariants}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      {!showOtpField ? (
        <motion.form 
          onSubmit={showPasswordField ? handlePasswordSubmit : handleIdentifierSubmit}
          variants={itemVariants}
        >
          <div className="space-y-3 sm:space-y-4">
            <motion.div variants={itemVariants}>
              <label htmlFor="identifier" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                Member ID or Email
              </label>
              <motion.input
                whileFocus={{ scale: 1.01, boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)' }}
                whileHover={hoverEffect}
                whileTap={tapEffect}
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="your@email.com or member ID"
                required
                disabled={isLoading}
              />
            </motion.div>

            {showPasswordField && (
              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <motion.button 
                    type="button" 
                    className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={tapEffect}
                  >
                    Forgot password?
                  </motion.button>
                </div>
                <motion.input
                  whileFocus={{ scale: 1.01, boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)' }}
                  whileHover={hoverEffect}
                  whileTap={tapEffect}
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </motion.div>
            )}

            <motion.button
              variants={itemVariants}
              whileHover={hoverEffect}
              whileTap={tapEffect}
              type="submit"
              disabled={isLoading}
              className="w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 text-sm sm:text-base flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                showPasswordField ? 'Continue' : 'Sign In'
              )}
            </motion.button>
          </div>
        </motion.form>
      ) : (
        <motion.div 
          variants={itemVariants}
          className="space-y-4"
        >
          <OtpInput 
            length={6} 
            onComplete={handleOtpVerification} 
            disabled={isLoading}
          />
          
          <motion.div 
            variants={itemVariants}
            className="text-center text-sm text-gray-500 dark:text-gray-400"
          >
            {otpSent ? (
              <p>We've sent a verification code to your registered phone</p>
            ) : (
              <p>Waiting to send verification code...</p>
            )}
            
            <motion.button
              type="button"
              onClick={handleResendOtp}
              disabled={countdown > 0 || isLoading}
              className={`mt-2 text-emerald-600 dark:text-emerald-400 hover:underline ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={countdown > 0 ? {} : { scale: 1.05 }}
              whileTap={tapEffect}
            >
              {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {!showOtpField && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          <span>Not a Carbon member yet?</span>
          <motion.button
            whileHover={{ scale: 1.05, color: '#10B981' }}
            whileTap={tapEffect}
            className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Learn about membership
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};