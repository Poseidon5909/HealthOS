import { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConsistencyAnalytics, PROGRESS_QUERY_KEYS } from '../../services/progressService';
import ConsistencyCard from './ConsistencyCard';
import ConsistencyOverviewHeader from './ConsistencyOverviewHeader';
import ConsistencyOverviewInsights from './ConsistencyOverviewInsights';
import { Card, ErrorState, Loader } from '../ui';

/**
 * ConsistencyOverview Component (Day 11)
 * 
 * Container component that:
 * 1. Fetches consistency analytics from backend
 * 2. Displays loading and error states
 * 3. Renders ConsistencyCard for each category
 * 4. Shows overall consistency summary
 * 
 * Data Sources:
 * - GET /progress/consistency
 * 
 * Categories tracked:
 * - Food Logging (diary entries)
 * - Workout Logging (exercise sessions)
 * - Hydration Logging (water intake)
 * - Weight Logging (body weight tracking)
 * 
 * Why React Query for analytics:
 * 1. Automatic caching - prevents duplicate API calls
 * 2. Background refetching - keeps data fresh
 * 3. Stale-while-revalidate - instant UI, updates in background
 * 4. Built-in loading/error states
 * 5. Automatic retries on failure
 * 
 * React Query caching prevents unnecessary API requests:
 * - First visit: Fetches from API
 * - Return visit (within 5 min): Uses cached data instantly
 * - Background refetch: Silently updates cache
 * - Result: Faster UX + reduced server load
 */

function ConsistencyOverview({ days = 30 }) {
  const {
    data: consistencyData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: PROGRESS_QUERY_KEYS.consistency(days),
    queryFn: () => getConsistencyAnalytics(days),
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const categoryConfigs = useMemo(() => ([
    { key: 'food_logging', title: 'Food Logging', icon: '🍽️' },
    { key: 'workout_logging', title: 'Workout Logging', icon: '💪' },
    { key: 'hydration_logging', title: 'Hydration Logging', icon: '💧' },
    { key: 'weight_logging', title: 'Weight Logging', icon: '⚖️' }
  ]), []);

  const overallConsistency = useMemo(() => {
    if (!consistencyData) {
      return 0;
    }

    const values = categoryConfigs.map((config) => consistencyData?.[config.key]?.consistency_percentage || 0);
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }, [categoryConfigs, consistencyData]);

  // ========================================
  // LOADING STATE
  // ========================================
  if (isLoading) {
    return (
      <Card>
        <Loader label="Loading consistency analytics..." />
      </Card>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================
  if (isError) {
    return <ErrorState title="Failed to load analytics" error={error} onRetry={() => refetch()} />;
  }

  // ========================================
  // SUCCESS STATE - DISPLAY ANALYTICS
  // ========================================
  return (
    <div className="space-y-6">
      <ConsistencyOverviewHeader days={days} overallConsistency={overallConsistency} />

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryConfigs.map((config) => {
          const categoryData = consistencyData[config.key];
          
          if (!categoryData) {
            return (
              <div key={config.key} className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">
                <p>No data available</p>
              </div>
            );
          }

          return (
            <ConsistencyCard
              key={config.key}
              title={config.title}
              icon={config.icon}
              daysLogged={categoryData.days_logged}
              totalDays={categoryData.total_days}
              percentage={categoryData.consistency_percentage}
            />
          );
        })}
      </div>

      <ConsistencyOverviewInsights />
    </div>
  );
}

export default memo(ConsistencyOverview);
