import axios from 'axios';
import { toast } from 'react-hot-toast';
import { parseErrorMessage } from '../utils/validation';

/**
 * API Configuration
 * 
 * IMPORTANT: Backend must be running on http://localhost:8000
 * Run backend: cd backend && uvicorn app.main:app --reload
 * 
 * All API requests will be prefixed with /api/v1
 * Example: api.post('/auth/login') → http://localhost:8000/api/v1/auth/login
 */

// API Base URL - DO NOT add trailing slash
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config || {};
    const status = error?.response?.status;
    const requestUrl = originalRequest.url || '';
    const isAuthRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/users/');

    if (status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('accessToken', access_token);

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast.error('Please log in to continue.');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (!error.response) {
      toast.error('Cannot reach server. Please check your network or backend server.');
      return Promise.reject(error);
    }

    if ((status >= 500 || status === 404 || status === 422) && !isAuthRequest) {
      toast.error(parseErrorMessage(error));
    }

    return Promise.reject(error);
  }
);

export default api;
