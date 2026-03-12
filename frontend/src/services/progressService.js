import api from './api';

/**
 * Progress Service
 * 
 * Handles all progress-related API calls:
 * - Log weight entry
 * - Get weight history
 * - Get weekly summary
 * - Delete weight log
 * - Update weight log
 */

/**
 * Log a weight entry
 * 
 * @param {Object} weightData
 * @param {number} weightData.weight - Weight in kilograms (20-500)
 * @param {string} weightData.date - Optional date in YYYY-MM-DD format
 * @returns {Promise} Created weight log entry
 * 
 * Example:
 * logWeight({ weight: 75.5, date: '2026-03-10' })
 */
export const logWeight = async (weightData) => {
  const response = await api.post('/progress/weight', weightData);
  return response.data;
};

/**
 * Get complete weight history
 * 
 * Returns list of all weight log entries sorted by date (oldest to newest).
 * Includes: id, weight, date, created_at
 * 
 * @param {number} skip - Number of items to skip (default: 0)
 * @param {number} limit - Number of items to return (default: 100)
 * @returns {Promise} Array of weight log entries
 */
export const getWeightHistory = async (skip = 0, limit = 100) => {
  const response = await api.get('/progress/weight/history', {
    params: { skip, limit }
  });
  return response.data;
};

/**
 * Get weekly weight change summary
 * 
 * Returns comparison between current weight and weight from 7 days ago:
 * - current_weight: Latest weight entry
 * - week_ago_weight: Weight from 7 days ago
 * - change_kg: Weight change in kg (negative = weight loss)
 * - change_percentage: Percentage change
 * 
 * @returns {Promise} Weekly summary object
 */
export const getWeeklySummary = async () => {
  const response = await api.get('/progress/weekly-summary');
  return response.data;
};

/**
 * Delete a weight log entry
 * 
 * @param {number} logId - Weight log ID to delete
 * @returns {Promise} Deletion confirmation
 */
export const deleteWeightLog = async (logId) => {
  const response = await api.delete(`/progress/weight/${logId}`);
  return response.data;
};

/**
 * Update a weight log entry
 * 
 * @param {number} logId - Weight log ID to update
 * @param {Object} updateData - Fields to update
 * @param {number} updateData.weight - New weight value
 * @param {string} updateData.date - New date in YYYY-MM-DD format
 * @returns {Promise} Updated weight log
 */
export const updateWeightLog = async (logId, updateData) => {
  const response = await api.put(`/progress/weight/${logId}`, updateData);
  return response.data;
};

/**
 * Get consistency analytics (Day 11)
 * 
 * Returns tracking consistency across all health categories:
 * - food_logging: Food diary consistency
 * - workout_logging: Exercise tracking consistency
 * - hydration_logging: Water intake consistency
 * - weight_logging: Weight tracking consistency
 * 
 * Each category includes:
 * - days_logged: Number of days tracked
 * - total_days: Total days in period (default 30)
 * - consistency_percentage: (days_logged / total_days) * 100
 * 
 * @param {number} days - Number of days to analyze (default: 30)
 * @returns {Promise} Consistency metrics for all categories
 * 
 * Example response:
 * {
 *   food_logging: { days_logged: 25, total_days: 30, consistency_percentage: 83.3 },
 *   workout_logging: { days_logged: 18, total_days: 30, consistency_percentage: 60.0 },
 *   weight_logging: { days_logged: 28, total_days: 30, consistency_percentage: 93.3 },
 *   hydration_logging: { days_logged: 27, total_days: 30, consistency_percentage: 90.0 }
 * }
 */
export const getConsistencyAnalytics = async (days = 30) => {
  const response = await api.get('/progress/consistency', {
    params: { days }
  });
  return response.data;
};

/**
 * React Query keys for caching
 * 
 * These keys organize cached data:
 * - Helps invalidate specific cache entries
 * - Enables smart refetching
 * - Prevents unnecessary API calls
 * 
 * React Query Caching Benefits:
 * 1. Prevents duplicate API requests (same query = cached result)
 * 2. Background refetching keeps data fresh
 * 3. Stale-while-revalidate pattern (show cached data, update in background)
 * 4. Automatic garbage collection of unused cache
 * 5. Reduces server load and improves UX
 */
export const PROGRESS_QUERY_KEYS = {
  weightHistory: ['progress', 'weight', 'history'],
  weeklySummary: ['progress', 'weekly-summary'],
  weightLog: (logId) => ['progress', 'weight', logId],
  consistency: (days) => ['progress', 'consistency', days]
};
