import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWeightHistory,
  getWeeklySummary,
  logWeight,
  deleteWeightLog,
  PROGRESS_QUERY_KEYS
} from '../../services/progressService';

// Import progress components
import WeightLogForm from '../../components/progress/WeightLogForm';
import WeeklySummaryCard from '../../components/progress/WeeklySummaryCard';
import WeightHistoryList from '../../components/progress/WeightHistoryList';
import WeightChart from '../../components/progress/WeightChart';

// Import analytics components (Day 11)
import ConsistencyOverview from '../../components/analytics/ConsistencyOverview';

/**
 * Progress Page (Day 10 + Day 11)
 * 
 * Complete weight tracking system with:
 * - Weight logging form with validation
 * - Weekly progress summary
 * - Visual weight trend chart
 * - Complete weight history
 * - Real-time updates using React Query
 * 
 * React Query Benefits (Server State Management):
 * - Automatic caching: No duplicate API calls, faster UX
 * - Background refetching: Data stays fresh automatically
 * - Optimistic updates: Instant UI feedback
 * - Cache invalidation: Smart synchronization after changes
 * - Error handling: Built-in retry logic
 * - Loading states: Automatic pending/error/success states
 * 
 * Why React Query is essential for modern apps:
 * 1. Reduces boilerplate - no manual loading/error states
 * 2. Better UX - instant updates and smart caching
 * 3. Network efficiency - deduplicates requests
 * 4. Fresh data - automatic background updates
 * 5. Resilience - automatic retries on failure
 */

function Progress() {
  console.log('🎯 Progress component mounting...');
  
  const queryClient = useQueryClient();
  const [deletingLogId, setDeletingLogId] = useState(null);

  // ========================================
  // DATA FETCHING with React Query
  // ========================================

  /**
   * Fetch weight history
   * 
   * React Query automatically:
   * - Caches the data
   * - Refetches when window regains focus
   * - Refetches when network reconnects
   * - Shares data across components using the same key
   */
  const {
    data: weightHistory = [],
    isLoading: isHistoryLoading,
    error: historyError
  } = useQuery({
    queryKey: PROGRESS_QUERY_KEYS.weightHistory,
    queryFn: async () => {
      try {
        console.log('📊 Fetching weight history...');
        const data = await getWeightHistory(0, 100);
        console.log('✅ Weight history loaded:', data);
        return data;
      } catch (error) {
        console.error('❌ Weight history error:', error);
        console.error('Response:', error?.response?.data);
        throw error;
      }
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus for now
    retry: false // Disable retries to see errors immediately
  });

  /**
   * Fetch weekly summary
   * 
   * This query depends on weight data existing.
   * React Query handles the coordination automatically.
   */
  const {
    data: weeklySummary,
    isLoading: isSummaryLoading,
    error: summaryError
  } = useQuery({
    queryKey: PROGRESS_QUERY_KEYS.weeklySummary,
    queryFn: async () => {
      try {
        console.log('📊 Fetching weekly summary...');
        const data = await getWeeklySummary();
        console.log('✅ Weekly summary loaded:', data);
        return data;
      } catch (error) {
        console.error('❌ Weekly summary error:', error);
        console.error('Response:', error?.response?.data);
        throw error;
      }
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: false
  });

  // ========================================
  // MUTATIONS with React Query
  // ========================================

  /**
   * Log weight mutation
   * 
   * When weight is logged:
   * 1. API call is made
   * 2. On success, invalidate both queries
   * 3. React Query automatically refetches
   * 4. UI updates with fresh data
   * 
   * This is called "cache invalidation" - telling React Query
   * that certain data is now stale and needs to be refetched.
   */
  const logWeightMutation = useMutation({
    mutationFn: (weightData) => logWeight(weightData),
    onSuccess: () => {
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weightHistory });
      queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weeklySummary });
    },
    onError: (error) => {
      console.error('Failed to log weight:', error);
      alert('Failed to log weight. Please try again.');
    }
  });

  /**
   * Delete weight log mutation
   * 
   * Similar pattern to logging - invalidate cache after deletion
   * to ensure UI stays synchronized with backend.
   */
  const deleteWeightMutation = useMutation({
    mutationFn: (logId) => deleteWeightLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weightHistory });
      queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weeklySummary });
      setDeletingLogId(null);
    },
    onError: (error) => {
      console.error('Failed to delete weight log:', error);
      alert('Failed to delete weight log. Please try again.');
      setDeletingLogId(null);
    }
  });

  // ========================================
  // EVENT HANDLERS
  // ========================================

  /**
   * Handle logging weight
   * Called from WeightLogForm component
   */
  const handleLogWeight = async (weightData) => {
    await logWeightMutation.mutateAsync(weightData);
  };

  /**
   * Handle deleting a weight log
   * Called from WeightHistoryList component
   */
  const handleDeleteLog = async (logId) => {
    setDeletingLogId(logId);
    await deleteWeightMutation.mutateAsync(logId);
  };

  // ========================================
  // ERROR HANDLING
  // ========================================

  if (historyError || summaryError) {
    const error = historyError || summaryError;
    const errorDetails = error?.response?.data?.error;

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">📈</span>
            Progress
          </h1>
          <p className="text-gray-600 mt-2">View your weight trends and fitness analytics</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 text-xl mb-2">⚠️ Error Loading Data</div>
          <p className="text-red-800 font-semibold">
            {errorDetails?.message || error?.message || 'Failed to load progress data'}
          </p>
          
          <button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weightHistory });
              queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weeklySummary });
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
          <span className="mr-3">📈</span>
          Progress & Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          Track your health journey with weight tracking and consistency analytics
        </p>
      </div>

      {/* Consistency Analytics Section (Day 11) */}
      <div className="mb-8">
        <ConsistencyOverview days={30} />
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-200 my-8"></div>

      {/* Weight Tracking Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">⚖️</span>
          Weight Tracking
        </h2>
        <p className="text-gray-600 mt-1">
          Monitor your weight changes over time
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Form and Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Weight Log Form */}
          <WeightLogForm
            onSubmit={handleLogWeight}
            isLogging={logWeightMutation.isPending}
          />

          {/* Weekly Summary */}
          <WeeklySummaryCard
            summary={weeklySummary}
            isLoading={isSummaryLoading}
          />
        </div>

        {/* Right Column - Chart and History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weight Trend Chart */}
          <WeightChart
            data={weightHistory}
            isLoading={isHistoryLoading}
          />

          {/* Weight History List */}
          <WeightHistoryList
            history={weightHistory}
            onDelete={handleDeleteLog}
            deletingLogId={deletingLogId}
            isLoading={isHistoryLoading}
          />
        </div>
      </div>

      {/* Helpful Tips Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Weight Tracking Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="mr-2 mt-1">✓</span>
              <div>
                <span className="font-semibold">Consistency is key:</span> Weigh yourself at the same time each day, preferably in the morning
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-1">✓</span>
              <div>
                <span className="font-semibold">Use the same scale:</span> Different scales can show different readings
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="mr-2 mt-1">✓</span>
              <div>
                <span className="font-semibold">Focus on trends:</span> Daily fluctuations are normal, look at weekly changes
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-1">✓</span>
              <div>
                <span className="font-semibold">Be patient:</span> Healthy weight loss is 0.5-1 kg per week
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Progress;
