import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/Auth/LoginForm';

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
    <div className="min-h-screen bg-white dark:bg-gray-800 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={leftVariants}
          className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-700 relative flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          <div className="relative z-10 flex-grow flex flex-col p-6 sm:p-8 md:p-12 justify-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="flex items-center gap-3 mb-8"
            >
              <motion.svg
                className="w-8 h-8 sm:w-10 sm:h-10"
                viewBox="0 0 24 24"
                fill="none"
                initial={{ rotate: -30, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.9, type: 'spring' }}
              >
                <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
              <motion.span
                className="text-2xl sm:text-3xl font-bold tracking-tight"
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
              className="space-y-4 sm:space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                Premium Care.<br className="hidden sm:block" /> Simplified.
              </h2>
              <motion.p
                className="text-base sm:text-lg text-white/90 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                Your credit-based system for seamless clinical services access
              </motion.p>
              <motion.ul
                className="space-y-2 sm:space-y-3 text-emerald-100 text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <li className="flex items-start">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>2 monthly clinical credits (rolls over)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Flexible booking for Dietitians, Biokineticists & Physios</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pay-as-you-go options when credits are low</span>
                </li>
              </motion.ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-sm sm:max-w-md"
          >
            <LoginForm navigate={navigate} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
