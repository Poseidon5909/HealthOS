import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getDailyHydration, 
  getHydrationHistory, 
  logWater, 
  deleteWaterLog,
  HYDRATION_QUERY_KEYS 
} from '../../services/hydrationService';
import { getTodayDailyTargets, NUTRITION_QUERY_KEYS } from '../../services/nutritionTargetsService';

// Import hydration components
import WaterProgressCard from '../../components/hydration/WaterProgressCard';
import WaterLogButtons from '../../components/hydration/WaterLogButtons';
import WaterHistoryList from '../../components/hydration/WaterHistoryList';
import DailyTargetsCard from '../../components/nutrition/DailyTargetsCard';

/**
 * Hydration Page (Day 9)
 * 
 * Complete hydration tracking system with:
 * - Daily water progress display
 * - Quick water intake buttons
 * - Hydration history with delete functionality
 * - Real-time updates using React Query
 * 
 * React Query Benefits:
 * - Automatic caching: Previously fetched data is cached and reused
 * - Automatic refetching: Data stays fresh with background updates
 * - Optimistic updates: UI updates immediately for better UX
 * - Error handling: Built-in retry logic and error states
 * - Cache invalidation: Smart synchronization after mutations
 */

function Hydration() {
  const queryClient = useQueryClient();
  const [deletingLogId, setDeletingLogId] = useState(null);

  // ========================================
  // DATA FETCHING with React Query
  // ========================================

  /**
   * Fetch daily hydration summary
   * 
   * React Query will:
   * - Cache this data with key ['hydration', 'daily']
   * - Refetch automatically when window regains focus
   * - Refetch when network reconnects
   * - Reuse cached data during navigation
   */
  const { 
    data: dailySummary, 
    isLoading: isDailyLoading,
    error: dailyError
  } = useQuery({
    queryKey: HYDRATION_QUERY_KEYS.daily,
    queryFn: getDailyHydration,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
    onError: (error) => {
      console.error('Daily hydration error:', error);
      console.error('Error response:', error.response?.data);
    }
  });

  /**
   * Fetch hydration history
   * 
   * This query fetches all water log entries.
   * React Query manages caching and updates automatically.
   */
  const { 
    data: history = [], 
    isLoading: isHistoryLoading,
    error: historyError
  } = useQuery({
    queryKey: HYDRATION_QUERY_KEYS.history,
    queryFn: getHydrationHistory,
    staleTime: 30000,
    onError: (error) => {
      console.error('History error:', error);
      console.error('Error response:', error.response?.data);
    }
  });

  const {
    data: dailyTargets,
  } = useQuery({
    queryKey: NUTRITION_QUERY_KEYS.todayTargets,
    queryFn: getTodayDailyTargets,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // ========================================
  // MUTATIONS with React Query
  // ========================================

  /**
   * Log water intake mutation
   * 
   * When water is logged:
   * 1. API call is made to backend
   * 2. On success, both daily and history queries are invalidated
   * 3. React Query automatically refetches the invalidated data
   * 4. UI updates with fresh data
   */
  const logWaterMutation = useMutation({
    mutationFn: (amount_ml) => logWater({ amount_ml }),
    onSuccess: () => {
      // Invalidate and refetch both queries
      queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.daily });
      queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.history });
    },
    onError: (error) => {
      console.error('Failed to log water:', error);
      alert('Failed to log water intake. Please try again.');
    }
  });

  /**
   * Delete water log mutation
   * 
   * Similar to logging, but deletes an entry.
   * Cache invalidation ensures UI stays synchronized.
   */
  const deleteWaterMutation = useMutation({
    mutationFn: (logId) => deleteWaterLog(logId),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.daily });
      queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.history });
      setDeletingLogId(null);
    },
    onError: (error) => {
      console.error('Failed to delete water log:', error);
      alert('Failed to delete water log. Please try again.');
      setDeletingLogId(null);
    }
  });

  // ========================================
  // EVENT HANDLERS
  // ========================================

  /**
   * Handle logging water
   * Called from WaterLogButtons component
   */
  const handleLogWater = async (amount_ml) => {
    await logWaterMutation.mutateAsync(amount_ml);
  };

  /**
   * Handle deleting a water log
   * Called from WaterLogItem component
   */
  const handleDeleteLog = async (logId) => {
    setDeletingLogId(logId);
    await deleteWaterMutation.mutateAsync(logId);
  };

  // ========================================
  // ERROR HANDLING
  // ========================================

  if (dailyError || historyError) {
    const error = dailyError || historyError;
    const errorDetails = error?.response?.data?.error;
    
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">💧</span>
            Hydration
          </h1>
          <p className="text-gray-600 mt-2">Monitor your daily water intake</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 text-xl mb-2">⚠️ Error Loading Data</div>
          <p className="text-red-800 font-semibold mb-2">
            {errorDetails?.message || error?.message || 'Failed to load hydration data'}
          </p>
          
          {/* Show validation details if available */}
          {errorDetails?.details && (
            <div className="mt-4 p-3 bg-red-100 rounded text-sm">
              <p className="font-semibold mb-2">Validation Errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {errorDetails.details.map((detail, index) => (
                  <li key={index} className="text-red-900">
                    <span className="font-medium">{detail.field}:</span> {detail.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Show raw error for debugging */}
          <details className="mt-4">
            <summary className="cursor-pointer text-red-700 text-sm">Show technical details</summary>
            <pre className="mt-2 p-3 bg-red-100 rounded text-xs overflow-auto">
              {JSON.stringify(error?.response?.data || error, null, 2)}
            </pre>
          </details>
          
          <button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.daily });
              queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.history });
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">💧</span>
          Hydration Tracker
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor your daily water intake and stay hydrated
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress and Quick Add */}
        <div className="lg:col-span-1 space-y-6">
          <DailyTargetsCard
            targets={dailyTargets}
            title="Saved Daily Targets"
            description="Hydration progress uses the shared water goal saved in your daily targets so your intake percentage stays aligned with your nutrition plan."
            compact
          />

          {/* Daily Progress Card */}
          <WaterProgressCard 
            dailySummary={dailySummary} 
            isLoading={isDailyLoading}
          />
          
          {/* Quick Add Buttons */}
          <WaterLogButtons 
            onLogWater={handleLogWater}
            isLogging={logWaterMutation.isPending}
          />
        </div>

        {/* Right Column - History */}
        <div className="lg:col-span-2">
          <WaterHistoryList 
            history={history}
            onDeleteLog={handleDeleteLog}
            deletingLogId={deletingLogId}
            isLoading={isHistoryLoading}
          />
        </div>
      </div>

      {/* Helpful Tips Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Hydration Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Drink water regularly throughout the day, not just when you're thirsty</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Start your day with a glass of water to kickstart your metabolism</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Keep a water bottle with you to make drinking water more convenient</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Increase water intake during exercise or hot weather</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Hydration;
