import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

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

  // Left side animations
  const leftVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 60,
        delay: 0.4
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Animated Branding Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={leftVariants}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
        />
        
        <motion.div 
          className="relative z-10 flex flex-col justify-between p-12 text-white h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="flex items-center gap-3"
          >
            <motion.svg 
              className="w-10 h-10"
              viewBox="0 0 24 24" 
              fill="none"
              initial={{ rotate: -30, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring' }}
            >
              <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
            <motion.span 
              className="text-3xl font-bold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              Carbon
            </motion.span>
          </motion.div>
          
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, type: 'spring' }}
            className="space-y-6"
          >
            <h2 className="text-5xl font-bold leading-tight">Intelligent Booking.<br/>Perfected.</h2>
            <motion.p 
              className="text-lg text-white/90 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              The enterprise-grade solution for modern appointment management.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white dark:bg-gray-800"
      >
         <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center mb-8"
          >
            <svg className="w-12 h-12 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-white">Carbon</h1>
          </motion.div>

          <motion.div variants={containerVariants} className="space-y-6">
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-gray-200">
                Welcome to Carbon
              </h2>
              <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
                Please enter your credentials to continue
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01, boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)' }}
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <a href="#" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <motion.input
                  whileFocus={{ scale: 1.01, boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)' }}
                  id="password"
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <motion.button
                whileHover={hoverEffect}
                whileTap={tapEffect}
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-md transition-all duration-300"
              >
                Sign In
              </motion.button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
            >
              <span>New to Carbon?</span>
              <motion.a
                whileHover={{ scale: 1.05, color: '#10B981' }}
                href="#"
                className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Contact admin
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};