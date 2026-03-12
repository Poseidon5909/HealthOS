/**
 * Validation Utilities
 * Client-side form validation helpers
 * Note: These are for UX only. Backend MUST also validate.
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 * 
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate that two passwords match
 * @param {string} password - First password
 * @param {string} confirmPassword - Second password to compare
 * @returns {boolean} True if passwords match
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validate name (not empty, reasonable length)
 * @param {string} name - Name to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.length > 100) {
    return { isValid: false, error: 'Name must be less than 100 characters' };
  }

  return { isValid: true, error: null };
};

/**
 * Parse backend error response
 * Handles different error formats from FastAPI
 * 
 * @param {Object} error - Axios error object
 * @returns {string} User-friendly error message
 */
export const parseErrorMessage = (error) => {
  // Network error (no response from server)
  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  const { status, data } = error.response;

  // Handle specific status codes
  switch (status) {
    case 400:
      return data?.detail || 'Invalid request. Please check your input.';
    
    case 401:
      return data?.detail || data?.message || 'Unauthorized request.';
    
    case 422:
      // FastAPI validation errors
      if (data?.detail && Array.isArray(data.detail)) {
        const messages = data.detail.map(err => err.msg).join(', ');
        return messages || 'Validation error. Please check your input.';
      }
      return data?.detail || 'Validation error. Please check your input.';
    
    case 429:
      return 'Too many requests. Please try again later.';
    
    case 500:
      return 'Server error. Please try again later.';
    
    default:
      return data?.detail || data?.message || 'An error occurred. Please try again.';
  }
};
