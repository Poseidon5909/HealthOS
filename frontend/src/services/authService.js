import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const authService = {
  /**
   * Login user with email and password
   * 
   * ENDPOINT: POST /api/v1/auth/login
   * FORMAT: application/x-www-form-urlencoded (OAuth2 standard)
   * FIELDS: username (email), password
   * RETURNS: { access_token, refresh_token, token_type }
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response with tokens
   */
  login: async (email, password) => {
    // Backend expects form-data format (application/x-www-form-urlencoded)
    // This matches FastAPI's OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', email);  // OAuth2 uses 'username' field
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
