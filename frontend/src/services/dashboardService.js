import api from './api';

/**
 * Dashboard Service
 * 
 * Handles all dashboard-related API calls.
 * The dashboard endpoint returns a comprehensive overview of user's health data.
 */

/**
 * Fetch complete dashboard data
 * 
 * Returns:
 * - Calorie summary (target, consumed, remaining)
 * - Macro breakdown (protein, carbs, fat)
 * - Hydration progress
 * - Workout summary
 * - Weight snapshot
 * - Consistency metrics
 * 
 * Requires authentication token (automatically added by axios interceptor)
 */
export const getDashboardData = async () => {
  const response = await api.get('/dashboard/');
  return response.data;
};

/**
 * React Query hook key
 * Used for caching and cache invalidation
 */
export const DASHBOARD_QUERY_KEY = ['dashboard'];
