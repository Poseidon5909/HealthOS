import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTodayHabitStatus,
  getHabitStreaks,
  getHabitHistory,
  logHabit,
  deleteHabitLog,
  HABIT_QUERY_KEYS
} from '../../services/habitService';
import HabitStatusCard from '../../components/habits/HabitStatusCard';
import HabitStreakCard from '../../components/habits/HabitStreakCard';
import HabitHistoryList from '../../components/habits/HabitHistoryList';

function Habits() {
  console.log('🎯 Habits component rendering...');
  
  const queryClient = useQueryClient();
  const [deletingLogId, setDeletingLogId] = useState(null);

  const {
    data: todayStatus,
    isLoading: isStatusLoading,
    error: statusError
  } = useQuery({
    queryKey: HABIT_QUERY_KEYS.todayStatus,
    queryFn: getTodayHabitStatus,
    retry: false,
    onError: (error) => {
      console.error('❌ Today Status Error:', error.message);
    }
  });

  const {
    data: streaks,
    isLoading: isStreaksLoading,
    error: streaksError
  } = useQuery({
    queryKey: HABIT_QUERY_KEYS.streaks,
    queryFn: getHabitStreaks,
    retry: false,
    onError: (error) => {
      console.error('❌ Streaks Error:', error.message);
    }
  });

  const {
    data: history = [],
    isLoading: isHistoryLoading,
    error: historyError
  } = useQuery({
    queryKey: HABIT_QUERY_KEYS.history(0, 50),
    queryFn: () => getHabitHistory(0, 50),
    retry: false,
    onError: (error) => {
      console.error('❌ History Error:', error.message);
    }
  });

  const deleteHabitMutation = useMutation({
    mutationFn: (habitId) => deleteHabitLog(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.todayStatus });
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.streaks });
      queryClient.invalidateQueries({ queryKey: ['habits', 'history'] });
      setDeletingLogId(null);
    },
    onError: () => {
      alert('Failed to delete habit log');
      setDeletingLogId(null);
    }
  });

  const handleDeleteLog = async (logId) => {
    if (window.confirm('Delete this habit log?')) {
      setDeletingLogId(logId);
      await deleteHabitMutation.mutateAsync(logId);
    }
  };

  // Show loading state while initial queries are loading
  const isInitialLoading = isStatusLoading && isStreaksLoading && isHistoryLoading;
  if (isInitialLoading) {
    console.log('⏳ Habits page loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading habits...</p>
        </div>
      </div>
    );
  }

  // Check if all queries failed (likely authentication issue)
  const allQueriesFailed = statusError && streaksError && historyError;
  if (allQueriesFailed) {
    console.error('❌ All habit queries failed - possible auth issue');
    const isAuthError = statusError?.response?.status === 401;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isAuthError ? 'Authentication Required' : 'Unable to Load Habits'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isAuthError 
              ? 'Please log in to view your habits data.'
              : 'There was an error loading your habits. Please try again later.'}
          </p>
          <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-left">
            <p className="text-red-800 font-semibold mb-2">Error Details:</p>
            <p className="text-red-700 text-xs break-words">{statusError?.message || 'Unknown error'}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ Habits component rendered successfully');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">✅</span>
          Daily Habits
        </h1>
        <p className="text-gray-600 mt-2">Build consistency and track your healthy habits</p>
      </div>

      {(statusError || streaksError || historyError) && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <span>⚠️</span>
            <span className="font-semibold">Some data couldn't be loaded</span>
          </div>
          <p className="text-sm text-yellow-700 mt-2">
            {statusError && <div>• Status: {statusError.message}</div>}
            {streaksError && <div>• Streaks: {streaksError.message}</div>}
            {historyError && <div>• History: {historyError.message}</div>}
          </p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HabitStatusCard
            title="Hydration Goal"
            description="Meet your daily water intake target"
            icon="💧"
            isComplete={todayStatus?.hydration_complete || false}
            isLoading={isStatusLoading}
            completionText="Water goal achieved!"
            incompleteText="Keep drinking water"
          />
          <HabitStatusCard
            title="Nutrition Target"
            description="Stay within calorie and macro goals"
            icon="🍽️"
            isComplete={todayStatus?.nutrition_within_target || false}
            isLoading={isStatusLoading}
            completionText="Nutrition goals met!"
            incompleteText="Track your meals"
          />
          <HabitStatusCard
            title="Workout Complete"
            description="Complete at least one exercise session"
            icon="💪"
            isComplete={todayStatus?.workout_completed || false}
            isLoading={isStatusLoading}
            completionText="Workout logged!"
            incompleteText="Time to exercise"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Streaks 🔥</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HabitStreakCard
            title="Hydration"
            icon="💧"
            streak={streaks?.hydration_streak || 0}
            isLoading={isStreaksLoading}
          />
          <HabitStreakCard
            title="Nutrition"
            icon="🍽️"
            streak={streaks?.nutrition_streak || 0}
            isLoading={isStreaksLoading}
          />
          <HabitStreakCard
            title="Workout"
            icon="💪"
            streak={streaks?.workout_streak || 0}
            isLoading={isStreaksLoading}
          />
        </div>
      </div>

      <div className="mb-8">
        <HabitHistoryList
          history={history}
          isLoading={isHistoryLoading}
          onDelete={handleDeleteLog}
        />
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Habit Building Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="mr-2 mt-1">✓</span>
              <div>
                <span className="font-semibold">Start small:</span> Focus on consistency over perfection.
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-1">✓</span>
              <div>
                <span className="font-semibold">Track daily:</span> Tracking increases adherence by 42%.
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="mr-2 mt-1">✓</span>
              <div>
                <span className="font-semibold">Don't break the chain:</span> Protect your streak!
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-1">✓</span>
              <div>
                <span className="font-semibold">21-day rule:</span> It takes ~21 days to form a habit.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Habits;
