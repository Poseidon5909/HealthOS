import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * API Configuration
 * 
 * IMPORTANT: Backend must be running on http://localhost:8000
 * Run backend: cd HealthOS && .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
 * 
 * All API requests will be prefixed with /api/v1
 * Example: api.post('/auth/login') → http://localhost:8000/api/v1/auth/login
 */

// API Base URL - DO NOT add trailing slash
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Debug: Log the API URL being used
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔧 Environment:', import.meta.env.MODE);
console.log('✅ API client initialized');

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request Interceptor: Add auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (will be set by authStore later)
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

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Log successful requests for debugging
    console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Detailed error logging
    console.error('❌ API Error Details:');
    console.error('  URL:', error.config?.url);
    console.error('  Method:', error.config?.method?.toUpperCase());
    console.error('  Status:', error.response?.status);
    console.error('  Message:', error.response?.data?.detail || error.response?.data?.message || error.message);
    console.error('  Full Response:', error.response?.data);

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          console.log('🔄 Attempting to refresh token...');
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('accessToken', access_token);
          console.log('✅ Token refreshed successfully');

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } else {
          console.log('❌ No refresh token found - redirecting to login');
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        console.error('❌ Token refresh failed:', refreshError.message);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
