import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { OtpInput } from './OtpInput';
import axios from 'axios';

// Constants
const OTP_EXPIRY_SECONDS = 120; // 2 minutes standard
const RESEND_DELAY_MS = 1000; // 1 second delay between countdown updates

// Animation variants
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

export const LoginForm = ({ navigate }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  
  const [uiState, setUiState] = useState({
    showPasswordField: false,
    showOtpField: false,
    isLoading: false,
    error: '',
    otpSent: false,
    countdown: 0,
    loginStep: 'initial'
  });

  // Memoized API call handlers
  const sendOtp = useCallback(async (identifier) => {
    try {
      const response = await axios.post('/api/auth/send-otp', { identifier });
      return {
        ...response.data,
        expiresAt: Date.now() + OTP_EXPIRY_SECONDS * 1000
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send verification code');
    }
  }, []);

  const verifyOtp = useCallback(async (identifier, otp) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { identifier, otp });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid or expired OTP');
    }
  }, []);

  const loginWithPassword = useCallback(async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      return {
        ...response.data,
        expiresAt: Date.now() + OTP_EXPIRY_SECONDS * 1000
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  }, []);

  // Validation helpers
  const isEmail = useCallback((input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input), []);
  const isNumericId = useCallback((input) => /^\d+$/.test(input), []);

  // Form handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (uiState.error) setUiState(prev => ({ ...prev, error: '' }));
  }, [uiState.error]);

  const handleIdentifierSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isNumericId(formData.identifier) && !isEmail(formData.identifier)) {
      setUiState(prev => ({ ...prev, error: 'Please enter a valid member ID or email' }));
      return;
    }

    setUiState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      if (isNumericId(formData.identifier)) {
        const result = await sendOtp(formData.identifier);
        setUiState(prev => ({
          ...prev,
          otpSent: true,
          showOtpField: true,
          loginStep: 'otp',
          countdown: OTP_EXPIRY_SECONDS,
          isLoading: false
        }));
      } else {
        setUiState(prev => ({
          ...prev,
          showPasswordField: true,
          loginStep: 'password',
          isLoading: false
        }));
      }
    } catch (err) {
      setUiState(prev => ({ 
        ...prev, 
        error: err.message,
        isLoading: false 
      }));
    }
  }, [formData.identifier, isEmail, isNumericId, sendOtp]);

  const handlePasswordSubmit = useCallback(async (e) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const result = await loginWithPassword(formData.identifier, formData.password);
      
      if (result.requiresOtp) {
        setUiState(prev => ({
          ...prev,
          otpSent: true,
          showOtpField: true,
          loginStep: 'otp',
          countdown: OTP_EXPIRY_SECONDS,
          isLoading: false
        }));
      }
    } catch (err) {
      setUiState(prev => ({ 
        ...prev, 
        error: err.message,
        isLoading: false 
      }));
    }
  }, [formData.identifier, formData.password, loginWithPassword]);

  const handleOtpVerification = useCallback(async (otp) => {
    setUiState(prev => ({ ...prev, isLoading: true, error: '' }));
    
    try {
      const result = await verifyOtp(formData.identifier, otp);
      navigate(result.user.isMember 
        ? `/dashboard/user/${result.user.id}`
        : `/dashboard/admin/${result.user.id}`
      );
    } catch (err) {
      setUiState(prev => ({ 
        ...prev, 
        error: err.message,
        isLoading: false 
      }));
    }
  }, [formData.identifier, navigate, verifyOtp]);

  const handleResendOtp = useCallback(async () => {
    if (uiState.countdown > 0 || uiState.isLoading) return;
    
    setUiState(prev => ({ ...prev, isLoading: true, error: '' }));
    
    try {
      await sendOtp(formData.identifier);
      setUiState(prev => ({ 
        ...prev, 
        countdown: OTP_EXPIRY_SECONDS, 
        otpSent: true, 
        isLoading: false 
      }));
    } catch (err) {
      setUiState(prev => ({ 
        ...prev, 
        error: err.message,
        isLoading: false 
      }));
    }
  }, [formData.identifier, sendOtp, uiState.countdown, uiState.isLoading]);

  const handleBackToInitial = useCallback(() => {
    setUiState({
      showPasswordField: false,
      showOtpField: false,
      loginStep: 'initial',
      error: '',
      otpSent: false,
      countdown: 0,
      isLoading: false
    });
  }, []);

  // Optimized countdown timer
  useEffect(() => {
    let timer;
    if (uiState.countdown > 0) {
      timer = setTimeout(() => {
        setUiState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, RESEND_DELAY_MS);
    }
    return () => clearTimeout(timer);
  }, [uiState.countdown]);

  // Format countdown display
  const formatCountdown = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      {/* Logo and Title */}
      <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
        <motion.div
          className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center"
          whileHover={{ rotate: 10 }}
        >
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" />
            <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" />
            <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" />
          </svg>
        </motion.div>
        <motion.h1 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
          {uiState.loginStep === "otp" ? "Verify Identity" : "Welcome Back"}
        </motion.h1>
      </motion.div>

      {/* Error Display */}
      {uiState.error && (
        <motion.div
          variants={itemVariants}
          className="p-3 mb-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm"
        >
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{uiState.error}</span>
          </div>
        </motion.div>
      )}

      {/* OTP Verification View */}
      {uiState.loginStep === "otp" ? (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Enter Verification Code
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Sent to your registered {isEmail(formData.identifier) ? "email" : "phone number"}
            </p>
          </div>

          <OtpInput
            length={6}
            onComplete={handleOtpVerification}
            disabled={uiState.isLoading}
          />

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={uiState.countdown > 0 || uiState.isLoading}
              className={`text-emerald-600 dark:text-emerald-400 ${
                uiState.countdown > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"
              }`}
            >
              {uiState.countdown > 0 
                ? `Resend code in ${formatCountdown(uiState.countdown)}` 
                : "Resend code"}
            </button>

            <button
              type="button"
              onClick={handleBackToInitial}
              className="block mt-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:underline"
            >
              Back to login
            </button>
          </div>
        </motion.div>
      ) : (
        /* Main Login Form */
        <motion.form
          onSubmit={uiState.loginStep === "password" ? handlePasswordSubmit : handleIdentifierSubmit}
          variants={itemVariants}
          className="space-y-4"
        >
          <motion.div variants={itemVariants}>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {uiState.loginStep === "password" ? "Email" : "Member ID or Email"}
            </label>
            <input
              id="identifier"
              name="identifier"
              type={uiState.loginStep === "password" ? "email" : "text"}
              value={formData.identifier}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder={uiState.loginStep === 'password' ? 'your@email.com' : '12345 or your@email.com'}
              required
              disabled={uiState.isLoading}
            />
          </motion.div>

          {uiState.loginStep === "password" && (
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={uiState.isLoading}
              />
            </motion.div>
          )}

          <button
            type="submit"
            disabled={uiState.isLoading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-all duration-300 flex items-center justify-center"
          >
            {uiState.isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : uiState.loginStep === "password" ? (
              "Continue"
            ) : (
              "Sign In"
            )}
          </button>

          {uiState.loginStep === "initial" && (
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 text-center">
              <span>Not a member yet?</span>
              <button className="ml-1 font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                Learn about membership
              </button>
            </div>
          )}
        </motion.form>
      )}
    </motion.div>
  );
};