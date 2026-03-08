import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const authService = {
  /**
   * Login user with email and password
   * Note: Backend expects form-data, not JSON
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response with tokens
   */
  login: async (email, password) => {
    // Backend expects form-data format (application/x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append('username', email);  // Backend uses 'username' field
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  },

  /**
   * Register a new user
   * Note: Backend expects JSON format
   * 
   * @param {Object} userData - User registration data
   * @param {string} userData.name - Full name
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @returns {Promise} Response with user data
   */
  register: async (userData) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   * 
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} Response with new access token
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Get current user data
   * Requires valid access token
   * 
   * @returns {Promise} Response with user data
   */
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

export default authService;
