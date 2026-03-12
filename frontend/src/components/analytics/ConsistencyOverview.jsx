import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConsistencyAnalytics, PROGRESS_QUERY_KEYS } from '../../services/progressService';
import ConsistencyCard from './ConsistencyCard';

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
  console.log('📊 ConsistencyOverview rendering...');

  /**
   * Fetch consistency analytics with React Query
   * 
   * Benefits:
   * - Automatic caching (staleTime: 5 minutes)
   * - Background refetching when window refocuses
   * - Automatic retry on network errors
   * - Built-in loading/error states
   */
  const { 
    data: consistencyData, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: PROGRESS_QUERY_KEYS.consistency(days),
    queryFn: () => getConsistencyAnalytics(days),
    staleTime: 5 * 60 * 1000, // 5 minutes - analytics don't change rapidly
    refetchOnWindowFocus: true, // Refresh when user returns to app
  });

  /**
   * Calculate overall consistency percentage
   * Average across all categories
   */
  const calculateOverallConsistency = () => {
    if (!consistencyData) return 0;
    
    const categories = [
      consistencyData.food_logging,
      consistencyData.workout_logging,
      consistencyData.hydration_logging,
      consistencyData.weight_logging
    ];

    const sum = categories.reduce((acc, cat) => acc + (cat?.consistency_percentage || 0), 0);
    return sum / categories.length;
  };

  /**
   * Category configurations
   * Maps backend data to UI presentation
   */
  const categoryConfigs = [
    {
      key: 'food_logging',
      title: 'Food Logging',
      icon: '🍽️',
      description: 'Track your daily nutrition'
    },
    {
      key: 'workout_logging',
      title: 'Workout Logging',
      icon: '💪',
      description: 'Record your exercise sessions'
    },
    {
      key: 'hydration_logging',
      title: 'Hydration Logging',
      icon: '💧',
      description: 'Monitor your water intake'
    },
    {
      key: 'weight_logging',
      title: 'Weight Logging',
      icon: '⚖️',
      description: 'Track your body weight'
    }
  ];

  // ========================================
  // LOADING STATE
  // ========================================
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading consistency analytics...</span>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================
  if (isError) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">⚠️</span>
          <h3 className="text-lg font-semibold text-red-800">Failed to Load Analytics</h3>
        </div>
        <p className="text-red-700 mb-2">
          {error?.response?.data?.detail || error?.message || 'Unable to fetch consistency data'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const overallConsistency = calculateOverallConsistency();

  // ========================================
  // SUCCESS STATE - DISPLAY ANALYTICS
  // ========================================
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📊 Consistency Analytics</h2>
        <p className="text-blue-100 mb-4">
          Track your health tracking consistency over the last {days} days
        </p>
        
        {/* Overall Consistency Score */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
          <p className="text-sm text-blue-100 mb-1">Overall Consistency</p>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">{overallConsistency.toFixed(1)}%</div>
            <div className="flex-1">
              <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-700 ease-out"
                  style={{ width: `${overallConsistency}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Insights Section */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">Why Consistency Matters</h3>
            <p className="text-sm text-yellow-800 leading-relaxed">
              Research shows that consistent tracking increases health goal achievement by <strong>42%</strong>. 
              Even imperfect tracking (70%+) is significantly better than sporadic tracking. 
              Focus on maintaining streaks rather than perfection!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsistencyOverview;
