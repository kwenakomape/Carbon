import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OtpInput } from './OtpInput';
import { sendOtp, verifyOtp, loginWithPassword } from '../../../../backend/services/authService';

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

const hoverEffect = {
  scale: 1.02,
  transition: { type: 'spring', stiffness: 400, damping: 10 }
};

const tapEffect = { scale: 0.98 };

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
    loginStep: 'initial' // 'initial', 'password', 'otp'
  });

  const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIdentifierSubmit = async (e) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, error: '', isLoading: true }));
  
    try {
      const isNumericId = /^\d+$/.test(formData.identifier);
      
      if (isNumericId) {
        await sendOtp(formData.identifier);
        setUiState(prev => ({
          ...prev,
          otpSent: true,
          showOtpField: true,
          loginStep: 'otp',
          countdown: 60,
          isLoading: false
        }));
      } else if (isEmail(formData.identifier)) {
        setUiState(prev => ({
          ...prev,
          showPasswordField: true,
          loginStep: 'password',
          isLoading: false
        }));
      } else {
        throw new Error('Please enter a valid member ID or email');
      }
    } catch (err) {
      setUiState(prev => ({ 
        ...prev, 
        error: err.message || 'Failed to initiate login', 
        isLoading: false 
      }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, error: '', isLoading: true }));

    try {
      const result = await loginWithPassword(formData.identifier, formData.password);
      if (result.requiresOtp) {
        await sendOtp(formData.identifier);
        setUiState(prev => ({
          ...prev,
          otpSent: true,
          showOtpField: true,
          loginStep: 'otp',
          countdown: 60,
          isLoading: false
        }));
      }
    } catch (err) {
      setUiState(prev => ({ 
        ...prev, 
        error: err.message || 'Login failed', 
        isLoading: false 
      }));
    }
  };

  const handleOtpVerification = async (otp) => {
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
        error: err.message || 'Invalid OTP. Please try again.', 
        isLoading: false 
      }));
    }
  };

  const handleResendOtp = async () => {
    if (uiState.countdown > 0 || uiState.isLoading) return;
    
    setUiState(prev => ({ ...prev, isLoading: true, error: '' }));
    
    try {
      await sendOtp(formData.identifier);
      setUiState(prev => ({ 
        ...prev, 
        countdown: 60, 
        otpSent: true, 
        isLoading: false 
      }));
    } catch (err) {
      setUiState(prev => ({ 
        ...prev, 
        error: err.message || 'Failed to resend OTP', 
        isLoading: false 
      }));
    }
  };

  const handleBackToEmail = () => {
    setUiState({
      showPasswordField: false,
      showOtpField: false,
      loginStep: 'initial',
      error: '',
      otpSent: false,
      countdown: 0,
      isLoading: false
    });
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (uiState.countdown > 0) {
      timer = setTimeout(() => {
        setUiState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [uiState.countdown]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center mb-8"
      >
        <motion.div
          className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center"
          whileHover={{
            rotate: 10,
            transition: { type: "spring", stiffness: 300 },
          }}
        >
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 7L12 12L21 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 17L12 22L21 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 12L12 17L21 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <motion.h1
          className="mt-4 text-2xl font-bold text-gray-800 dark:text-white"
          whileHover={{ scale: 1.02 }}
        >
          {uiState.loginStep === "otp" ? "Verify Identity" : "Welcome Back"}
        </motion.h1>
      </motion.div>

      {uiState.error && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 mb-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm"
        >
          {uiState.error}
        </motion.div>
      )}

      {uiState.loginStep === "otp" ? (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Enter Verification Code
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Sent to your registered{" "}
              {isEmail(formData.identifier) ? "email" : "phone number"}
            </p>
          </div>

          <OtpInput
            length={6}
            onComplete={handleOtpVerification}
            disabled={uiState.isLoading}
          />

          <div className="text-center text-sm">
            <motion.button
              type="button"
              onClick={handleResendOtp}
              disabled={uiState.countdown > 0 || uiState.isLoading}
              className={`text-emerald-600 dark:text-emerald-400 ${
                uiState.countdown > 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:underline"
              }`}
              whileHover={uiState.countdown > 0 ? {} : { scale: 1.05 }}
              whileTap={tapEffect}
            >
              {uiState.countdown > 0 ? `Resend code in ${uiState.countdown}s` : "Resend code"}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleBackToEmail}
              className="block mt-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:underline"
              whileHover={{ scale: 1.02 }}
              whileTap={tapEffect}
            >
              Back to login
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          onSubmit={
            uiState.loginStep === "password"
              ? handlePasswordSubmit
              : handleIdentifierSubmit
          }
          variants={itemVariants}
          className="space-y-4"
        >
          <motion.div variants={itemVariants}>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {uiState.loginStep === "password" ? "Email" : "Member ID or Email"}
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              whileHover={hoverEffect}
              whileTap={tapEffect}
              id="identifier"
              name="identifier"
              type={uiState.loginStep === "password" ? "email" : "text"}
              value={formData.identifier}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder={uiState.loginStep === 'password' ? 'your@email.com' : '12345 or your@email.com'}
              required
              disabled={uiState.isLoading}
            />
          </motion.div>

          {uiState.loginStep === "password" && (
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <motion.button
                  type="button"
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={tapEffect}
                >
                  Forgot password?
                </motion.button>
              </div>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                whileHover={hoverEffect}
                whileTap={tapEffect}
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                disabled={uiState.isLoading}
              />
            </motion.div>
          )}

          <motion.button
            variants={itemVariants}
            whileHover={hoverEffect}
            whileTap={tapEffect}
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
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : uiState.loginStep === "password" ? (
              "Continue"
            ) : (
              "Sign In"
            )}
          </motion.button>

          {uiState.loginStep === "initial" && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 text-center"
            >
              <span>Not a member yet?</span>
              <motion.button
                whileHover={{ scale: 1.05, color: "#10B981" }}
                whileTap={tapEffect}
                className="ml-1 font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Learn about membership
              </motion.button>
            </motion.div>
          )}
        </motion.form>
      )}
    </motion.div>
  );
};