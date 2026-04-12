import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import authService from '../services/authService';

/**
 * useAuthInit Hook
 * 
 * Purpose:
 * Validates the persisted authentication session on app mount.
 * 
 * Why this is needed:
 * When a user refreshes the page, Zustand persist middleware restores
 * the auth state from localStorage. However, we don't know if that
 * session is still valid (token might be expired, user might be banned, etc.).
 * 
 * This hook:
 * 1. Checks if there are stored tokens
 * 2. Calls GET /users/me to validate the session
 * 3. If valid: Keeps user logged in with updated profile data
 * 4. If invalid: Clears the invalid session
 * 
 * Returns:
 * - isLoading: true while validating the session
 * - isReady: true when validation is complete
 */
const useAuthInit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  const { isAuthenticated, accessToken, setUser, logout } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated && accessToken) {
        try {
          const userData = await authService.getCurrentUser();

          setUser(userData);

        } catch (error) {
          logout();
        }
      }

      setIsLoading(false);
      setIsReady(true);
    };

    initializeAuth();
  }, []);

  return { isLoading, isReady };
};

export default useAuthInit;
