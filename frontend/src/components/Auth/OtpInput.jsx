import React, { useState, useEffect, useRef } from 'react';

export const OtpInput = ({ length = 6, onComplete, disabled = false }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only take last character
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Check if all inputs are filled
    if (newOtp.every(num => num !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (pasteData.length === length && !isNaN(pasteData)) {
      const pasteArray = pasteData.split('').slice(0, length);
      setOtp(pasteArray);
      onComplete(pasteArray.join(''));
    }
  };

  return (
    <div className="flex justify-center space-x-2 sm:space-x-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[index] = el)}
          disabled={disabled}
          className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      ))}
    </div>
  );
};