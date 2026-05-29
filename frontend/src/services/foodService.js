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
  const skip = Math.max(0, (page - 1) * pageSize);

  const response = await api.get('/food/search', {
    params: {
      query,
      skip,
      limit: pageSize,
    }
  });
  return response.data;
};

const normalizeFoodLog = (log) => ({
  ...log,
  food_name: log.food_name
    ?? log.food_item?.name
    ?? log.food?.name
    ?? (log.food_id ? `Food #${log.food_id}` : 'Food'),
  calories: log.calories ?? log.calculated_calories ?? 0,
  protein: log.protein ?? log.calculated_protein ?? 0,
  carbs: log.carbs ?? log.calculated_carbs ?? 0,
  fat: log.fat ?? log.calculated_fat ?? 0,
});

const normalizeMealSummary = (summary = {}) => ({
  total_calories: summary.total_calories ?? summary.calories ?? 0,
  total_protein: summary.total_protein ?? summary.protein ?? 0,
  total_carbs: summary.total_carbs ?? summary.carbs ?? 0,
  total_fat: summary.total_fat ?? summary.fat ?? 0,
  count: summary.count ?? summary.items_count ?? 0,
});

/**
 * Get today's food logs (all meals)
 * 
 * @returns {Promise} Today's food logs grouped by meal type
 */
export const getTodayFoodLogs = async () => {
  const today = new Date().toISOString().split('T')[0];
  const response = await api.get('/food-log/history', {
    params: {
      start_date: today,
      end_date: today,
      skip: 0,
      limit: 100,
    },
  });

  const items = response.data?.items || [];
  return items.map(normalizeFoodLog);
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
  return normalizeFoodLog(response.data);
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
  return normalizeFoodLog(response.data);
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
  const meals = response.data?.meals || response.data || {};

  return {
    breakfast: normalizeMealSummary(meals.breakfast),
    lunch: normalizeMealSummary(meals.lunch),
    dinner: normalizeMealSummary(meals.dinner),
    snack: normalizeMealSummary(meals.snack),
  };
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
