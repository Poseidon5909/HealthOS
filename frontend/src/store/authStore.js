import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Authentication Store
 * Manages user authentication state, tokens, and user data
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      /**
       * Set authentication data after successful login
       * @param {Object} userData - User information
       * @param {string} accessToken - JWT access token
       * @param {string} refreshToken - JWT refresh token
       */
      setAuth: (userData, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        set({
          user: userData,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      /**
       * Update user data (e.g., after profile update)
       * @param {Object} userData - Updated user information
       */
      setUser: (userData) => {
        set({ user: userData });
      },

      /**
       * Clear authentication and logout user
       */
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        window.location.href = '/login';
      },

      /**
       * Update access token (used by refresh token flow)
       * @param {string} newAccessToken - New JWT access token
       */
      updateAccessToken: (newAccessToken) => {
        localStorage.setItem('accessToken', newAccessToken);
        set({ accessToken: newAccessToken });
      },

      /**
       * Check if user is authenticated
       * @returns {boolean}
       */
      isLoggedIn: () => {
        const { isAuthenticated, accessToken } = get();
        return isAuthenticated && !!accessToken;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
