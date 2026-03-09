import api from './api';

/**
 * Food Service
 * 
 * Handles all food-related API calls:
 * - Search foods
 * - Get today's food logs
 * - Log food consumption
 * - Update food log
 * - Delete food log
 */

/**
 * Search for foods by name
 * 
 * @param {string} query - Search term
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Items per page (default: 20)
 * @returns {Promise} Search results with food items
 */
export const searchFoods = async (query, page = 1, pageSize = 20) => {
  const response = await api.get('/food/search', {
    params: {
      query,
      page,
      page_size: pageSize
    }
  });
  return response.data;
};

/**
 * Get today's food logs (all meals)
 * 
 * @returns {Promise} Today's food logs grouped by meal type
 */
export const getTodayFoodLogs = async () => {
  const response = await api.get('/food-log/today');
  return response.data;
};

/**
 * Log a food consumption entry
 * 
 * @param {Object} foodLogData
 * @param {number} foodLogData.food_id - ID of the food item
 * @param {number} foodLogData.quantity_grams - Quantity in grams
 * @param {string} foodLogData.meal_type - breakfast, lunch, dinner, or snack
 * @returns {Promise} Created food log entry
 */
export const logFood = async (foodLogData) => {
  const response = await api.post('/food-log/', foodLogData);
  return response.data;
};

/**
 * Update a food log entry
 * 
 * @param {number} logId - Food log ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise} Updated food log
 */
export const updateFoodLog = async (logId, updateData) => {
  const response = await api.put(`/food-log/${logId}`, updateData);
  return response.data;
};

/**
 * Delete a food log entry
 * 
 * @param {number} logId - Food log ID to delete
 * @returns {Promise} Deletion confirmation
 */
export const deleteFoodLog = async (logId) => {
  const response = await api.delete(`/food-log/${logId}`);
  return response.data;
};

/**
 * Get today's meal summaries
 * Returns nutrition totals for each meal type (breakfast, lunch, dinner, snack)
 * 
 * @returns {Promise} Object with meal summaries
 * Example: { breakfast: { total_calories: 450, total_protein: 20, ... }, ... }
 */
export const getTodayMealSummary = async () => {
  const response = await api.get('/food-log/meals/summary/today');
  return response.data;
};

/**
 * React Query keys for caching
 */
export const FOOD_QUERY_KEYS = {
  search: (query) => ['foods', 'search', query],
  todayLogs: ['foodLogs', 'today'],
  mealSummary: ['foodLogs', 'mealSummary', 'today'],
  log: (logId) => ['foodLogs', logId]
};
