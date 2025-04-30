import axios from 'axios';
import { sendSms } from './smsService';

const API_BASE_URL = '/api';

// Send OTP to member or specialist
export const sendSmsOtp = async (identifier) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, { identifier });
    
    // In production, you would actually send the SMS via your provider
    await sendSms({
      to: response.data.phoneNumber, // Retrieved from your backend
      body: `Your Carbon verification code is ${response.data.otp}. Valid for 10 minutes.`
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

// Verify OTP
export const verifyOtp = async (identifier, otp, isMemberLogin) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
      identifier,
      otp,
      isMemberLogin
    });
    
    // Store the auth token
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('userType', isMemberLogin ? 'member' : 'specialist');
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'OTP verification failed');
  }
};

// Password login for specialists/admins
export const loginWithPassword = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    
    // Store the auth token temporarily (will need OTP verification)
    sessionStorage.setItem('tempToken', response.data.tempToken);
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Check session status
export const checkAuthStatus = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/check-session`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem('authToken');
    return null;
  }
};