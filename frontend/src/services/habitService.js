import api from './api';

/**
 * Habit Service (Day 12)
 * 
 * Handles all habit-related API calls:
 * - Get today's habit completion status
 * - Get habit streaks
 * - Get habit history
 * - Log habit completion
 * 
 * Habit Types:
 * - hydration: Daily water goal completion
 * - nutrition: Daily calorie/macro target achievement
 * - workout: Exercise session completion
 * - meditation: Meditation practice (custom habit)
 * - sleep: Sleep quality tracking (custom habit)
 * 
 * Why service layer pattern:
 * 1. Centralized API logic - easier to maintain
 * 2. Consistent error handling
 * 3. Easy to mock for testing
 * 4. Decouples API from components
 * 5. Single source of truth for endpoints
 */

/**
 * Get today's habit completion status
 * 
 * Returns whether each habit type has been completed today.
 * Backend automatically calculates based on:
 * - Hydration: Water goal met
 * - Nutrition: Within calorie/macro targets
 * - Workout: Exercise logged today
 * 
 * @returns {Promise} Object with completion status for each habit
 * 
 * Example response:
 * {
 *   "hydration_complete": true,
 *   "nutrition_within_target": false,
 *   "workout_completed": true
 * }
 */
export const getTodayHabitStatus = async () => {
  const response = await api.get('/habits/today-status');
  return response.data;
};

/**
 * Get habit streaks
 * 
 * Returns current streak count for each habit type.
 * A streak is consecutive days of completion.
 * Resets to 0 if a day is missed.
 * 
 * @returns {Promise} Object with streak count for each habit
 * 
 * Example response:
 * {
 *   "hydration_streak": 7,
 *   "nutrition_streak": 3,
 *   "workout_streak": 5
 * }
 * 
 * Why streaks motivate users:
 * - Gamification: Makes tracking feel like a game
 * - Loss aversion: Don't want to "break the streak"
 * - Visual progress: Easy to see consistency
 * - Social proof: Can share achievements
 * - Dopamine trigger: Builds habit loop
 */
export const getHabitStreaks = async () => {
  try {
    const response = await api.get('/habits/streaks');
    return response.data;
  } catch (error) {
    const isTimeout =
      error?.code === 'ECONNABORTED' ||
      String(error?.message || '').toLowerCase().includes('timeout');

    // Keep the Habits page usable when streak calculations are slow.
    if (isTimeout) {
      return {
        hydration_streak: 0,
        nutrition_streak: 0,
        workout_streak: 0,
      };
    }

    throw error;
  }
};

/**
 * Get habit history
 * 
 * Returns chronological list of all habit log entries.
 * Useful for:
 * - Viewing past performance
 * - Identifying patterns
 * - Analyzing consistency over time
 * - Debugging streak calculations
 * 
 * @param {number} skip - Number of items to skip (pagination)
 * @param {number} limit - Number of items to return
 * @returns {Promise} Array of habit log entries
 * 
 * Backend returns a paginated object:
 * {
 *   "items": [ ...habit logs... ],
 *   "total": 42,
 *   "skip": 0,
 *   "limit": 50,
 *   "has_more": false
 * }
 *
 * This method normalizes the response and always returns an array.
 */
export const getHabitHistory = async (skip = 0, limit = 50) => {
  const response = await api.get('/habits/history', {
    params: { skip, limit }
  });

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return Array.isArray(response.data?.items) ? response.data.items : [];
};

/**
 * Log habit completion
 * 
 * Manually log a habit completion or failure.
 * Use for custom habits not automatically tracked.
 * 
 * @param {Object} habitData
 * @param {string} habitData.habit_type - Type of habit (hydration, nutrition, workout, meditation, etc.)
 * @param {boolean} habitData.success - Whether habit was completed successfully
 * @param {string} habitData.date - Optional date (YYYY-MM-DD format), defaults to today
 * @returns {Promise} Created habit log entry
 * 
 * Example:
 * logHabit({ habit_type: 'meditation', success: true })
 */
export const logHabit = async (habitData) => {
  const response = await api.post('/habits', habitData);
  return response.data;
};

/**
 * Delete habit log entry
 * 
 * Remove a habit log if logged by mistake.
 * 
 * @param {number} habitId - ID of habit log to delete
 * @returns {Promise} Deletion confirmation
 */
export const deleteHabitLog = async (habitId) => {
  const response = await api.delete(`/habits/${habitId}`);
  return response.data;
};

/**
 * React Query keys for caching
 * 
 * These keys organize cached habit data:
 * - Enables smart cache invalidation
 * - Prevents stale data
 * - Optimizes refetching
 * 
 * React Query pattern:
 * - Use array keys for hierarchical caching
 * - More specific keys inherit from general keys
 * - Invalidating ['habits'] invalidates all habit queries
 * - Invalidating ['habits', 'today'] only invalidates today's status
 * 
 * Why this matters:
 * When user logs a habit, we invalidate 'today' and 'streaks'
 * but NOT 'history' (since history doesn't change from one log).
 * This prevents unnecessary API calls while keeping UI fresh.
 */
export const HABIT_QUERY_KEYS = {
  all: ['habits'],
  todayStatus: ['habits', 'today-status'],
  streaks: ['habits', 'streaks'],
  history: (skip, limit) => ['habits', 'history', skip, limit],
  habitLog: (habitId) => ['habits', habitId]
};
