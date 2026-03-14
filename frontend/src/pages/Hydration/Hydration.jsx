import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
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
import { Card, ErrorState } from '../../components/ui';

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
      toast.success('Water logged successfully');
    },
    onError: (error) => {
      console.error('Failed to log water:', error);
      toast.error(error?.response?.data?.detail || 'Failed to log water intake. Please try again.');
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
      toast.error(error?.response?.data?.detail || 'Failed to delete water log. Please try again.');
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
    
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">💧</span>
            Hydration
          </h1>
          <p className="text-gray-600 mt-2">Monitor your daily water intake</p>
        </div>
        
        <ErrorState
          title="Error loading hydration data"
          error={error}
          onRetry={() => {
            queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.daily });
            queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.history });
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
      <Card className="mt-8 border-blue-200 bg-blue-50">
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
      </Card>
    </div>
  );
}

export default Hydration;
