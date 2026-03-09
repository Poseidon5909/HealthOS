import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import { getDashboardData, DASHBOARD_QUERY_KEY } from '../../services/dashboardService';

// Import dashboard components
import CalorieCard from '../../components/dashboard/CalorieCard';
import MacroProgress from '../../components/dashboard/MacroProgress';
import HydrationCard from '../../components/dashboard/HydrationCard';
import WorkoutSummary from '../../components/dashboard/WorkoutSummary';
import WeightCard from '../../components/dashboard/WeightCard';
import ConsistencyChart from '../../components/dashboard/ConsistencyChart';

/**
 * Dashboard Page
 * 
 * Main overview page displaying:
 * - Daily calorie and macro progress
 * - Hydration tracking
 * - Workout summary
 * - Weight snapshot
 * - Logging consistency metrics
 * 
 * Uses React Query for efficient data fetching and caching
 */
function Dashboard() {
  const { user } = useAuthStore();

  // Fetch dashboard data using React Query
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboardData,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name || 'User'}! Here's your health overview for today.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Unable to Load Dashboard
          </h3>
          <p className="text-red-600 mb-4">
            {error?.response?.data?.detail || error?.message || 'An error occurred'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Dashboard Content */}
      {!isLoading && !isError && dashboardData && (
        <div className="space-y-6">
          {/* Row 1: Calories, Macros, Hydration */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CalorieCard calories={dashboardData.calories} />
            <MacroProgress macros={dashboardData.macros} />
            <HydrationCard hydration={dashboardData.hydration} />
          </div>

          {/* Row 2: Workout, Weight, Consistency */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WorkoutSummary workout={dashboardData.workout} />
            <WeightCard weight={dashboardData.weight} />
            <ConsistencyChart consistency={dashboardData.consistency} />
          </div>

          {/* Refresh Indicator */}
          <div className="text-center mt-8">
            <button
              onClick={() => refetch()}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              🔄 Refresh Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
