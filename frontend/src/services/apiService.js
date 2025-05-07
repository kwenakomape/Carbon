import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const authAPI = {
  sendOTP: async (identifier) => {
    return axios.post(`${API_BASE_URL}/auth/send-otp`, { identifier });
  },

  verifyOTP: async (identifier, otp) => {
    return axios.post(`${API_BASE_URL}/auth/verify-otp`, { identifier, otp });
  },

  loginWithPassword: async (email, password) => {
    return axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  },

  checkSession: async (token) => {
    return axios.get(`${API_BASE_URL}/auth/check-session`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};