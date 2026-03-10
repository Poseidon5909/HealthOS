import api from './api';

/**
 * Hydration Service
 * 
 * Handles all hydration-related API calls:
 * - Log water intake
 * - Get daily hydration summary
 * - Get hydration history
 * - Delete water log
 */

/**
 * Log water intake
 * 
 * @param {Object} waterData
 * @param {number} waterData.amount_ml - Amount of water in milliliters
 * @returns {Promise} Created water log entry
 * 
 * Example:
 * logWater({ amount_ml: 500 })
 */
export const logWater = async (waterData) => {
  const response = await api.post('/hydration/', waterData);
  return response.data;
};

/**
 * Get daily hydration summary
 * 
 * Returns today's water consumption progress including:
 * - water_target_ml: Daily goal
 * - total_consumed_ml: Total consumed today
 * - remaining_ml: Remaining to reach goal
 * - progress_percentage: Percentage of goal achieved
 * 
 * @param {string} date - Optional date in YYYY-MM-DD format (defaults to today)
 * @returns {Promise} Daily hydration summary
 */
export const getDailyHydration = async (date = null) => {
  // Use provided date or default to today
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const response = await api.get('/hydration/daily', {
    params: { log_date: targetDate }
  });
  return response.data;
};

/**
 * Get hydration history
 * 
 * Returns list of water logs with:
 * - id
 * - amount_ml
 * - created_at (timestamp)
 * - date and time
 * 
 * @returns {Promise} Array of water log entries (paginated)
 */
export const getHydrationHistory = async () => {
  const response = await api.get('/hydration/history');
  // Backend returns paginated response with { items, total, skip, limit, has_more }
  // We only need the items array for the frontend
  return response.data.items || [];
};

/**
 * Delete a water log entry
 * 
 * @param {number} logId - Water log ID to delete
 * @returns {Promise} Deletion confirmation
 */
export const deleteWaterLog = async (logId) => {
  const response = await api.delete(`/hydration/${logId}`);
  return response.data;
};

/**
 * React Query keys for caching
 * 
 * These keys are used by React Query to:
 * - Cache data efficiently
 * - Invalidate cache when data changes
 * - Refetch data when needed
 */
export const HYDRATION_QUERY_KEYS = {
  daily: ['hydration', 'daily'],
  history: ['hydration', 'history'],
  log: (logId) => ['hydration', 'log', logId]
};
