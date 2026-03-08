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
      // If user appears to be authenticated (has tokens in store)
      if (isAuthenticated && accessToken) {
        try {
          // Validate the session by fetching current user
          console.log('🔄 Validating stored session...');
          const userData = await authService.getCurrentUser();
          
          // Session is valid - update user data in store
          console.log('✅ Session valid:', userData.email);
          setUser(userData);
          
        } catch (error) {
          // Session is invalid (401, expired token, etc.)
          console.log('❌ Session invalid, logging out');
          logout();
        }
      } else {
        // No stored session - user is not logged in
        console.log('ℹ️ No stored session found');
      }
      
      // Mark initialization as complete
      setIsLoading(false);
      setIsReady(true);
    };

    initializeAuth();
  }, []); // Run once on mount

  return { isLoading, isReady };
};

export default useAuthInit;
