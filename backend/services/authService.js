import axios from 'axios';
const API_BASE_URL = '/api';

// Send OTP to member or specialist
export const sendOtp = async (identifier) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, { identifier });
    
    // Note: The backend now returns success status but not the OTP (for security)
    // In production, implement actual SMS sending in the backend
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

// Verify OTP
export const verifyOtp = async (identifier, otp) => {  // Removed isMemberLogin parameter
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
      identifier,
      otp
    });
    
    // Store the auth token and user data
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('userData', JSON.stringify(response.data.user));
    
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
    
    // Store the temp token (for OTP verification step)
    sessionStorage.setItem('tempToken', response.data.tempToken);
    
    return {
      requiresOtp: true,
      ...response.data
    };
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
    
    // Update stored user data if needed
    if (response.data.user) {
      localStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    // Clear invalid token
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    return null;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};