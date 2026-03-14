import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
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
import { Card, ErrorState } from '../../components/ui';

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
    queryFn: () => getWeightHistory(0, 100),
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
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
    queryFn: getWeeklySummary,
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
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
      toast.success('Weight logged successfully');
    },
    onError: (error) => {
      console.error('Failed to log weight:', error);
      toast.error(error?.response?.data?.detail || 'Failed to log weight. Please try again.');
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
      toast.error(error?.response?.data?.detail || 'Failed to delete weight log. Please try again.');
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

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">📈</span>
            Progress
          </h1>
          <p className="text-gray-600 mt-2">View your weight trends and fitness analytics</p>
        </div>

        <ErrorState
          title="Error loading progress data"
          error={error}
          onRetry={() => {
            queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weightHistory });
            queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weeklySummary });
          }}
        />
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
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
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
      </Card>
    </div>
  );
}

export default Progress;
