import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { getDashboardData, DASHBOARD_QUERY_KEY } from '../../services/dashboardService';
import { Button, ErrorState, Skeleton } from '../../components/ui';

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

  const DashboardSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={`top-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5">
            <Skeleton className="mb-4 h-5 w-24" />
            <Skeleton className="mb-3 h-10 w-28" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={`bottom-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5">
            <Skeleton className="mb-4 h-5 w-28" />
            <Skeleton className="mb-2 h-6 w-16" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );

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
    staleTime: 3 * 60 * 1000,
    gcTime: 12 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const dashboardHighlights = dashboardData
    ? [
        { label: 'Calories', value: `${dashboardData?.calories?.consumed || 0} kcal` },
        { label: 'Hydration', value: `${dashboardData?.hydration?.progress_percentage?.toFixed?.(0) || 0}%` },
        { label: 'Workout', value: `${dashboardData?.workout?.duration_minutes || 0} min` }
      ]
    : [];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name || 'User'}! Here's your health overview for today.
        </p>
      </div>

      {!isLoading && !isError && dashboardData && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-6 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-600 via-indigo-600 to-sky-600 p-5 text-white"
        >
          <p className="text-sm text-indigo-100">Today at a glance</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {dashboardHighlights.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-indigo-100">{item.label}</p>
                <p className="mt-1 text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Loading State */}
      {isLoading && (
        <DashboardSkeleton />
      )}

      {/* Error State */}
      {isError && (
        <ErrorState title="Unable to load dashboard" error={error} onRetry={() => refetch()} />
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
            <Button
              onClick={() => refetch()}
              variant="ghost"
              size="sm"
            >
              🔄 Refresh Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
