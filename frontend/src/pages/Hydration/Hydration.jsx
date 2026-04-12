import { useState } from 'react';
import { Check, Droplets, Lightbulb } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  getDailyHydration, 
  getHydrationHistory, 
  logWater, 
  deleteWaterLog,
  HYDRATION_QUERY_KEYS 
} from '../../services/hydrationService';
import { HABIT_QUERY_KEYS } from '../../services/habitService';
import { getTodayDailyTargets, NUTRITION_QUERY_KEYS } from '../../services/nutritionTargetsService';

import WaterProgressCard from '../../components/hydration/WaterProgressCard';
import WaterLogButtons from '../../components/hydration/WaterLogButtons';
import WaterHistoryList from '../../components/hydration/WaterHistoryList';
import DailyTargetsCard from '../../components/nutrition/DailyTargetsCard';
import { Card, ErrorState } from '../../components/ui';

function Hydration() {
  const queryClient = useQueryClient();
  const [deletingLogId, setDeletingLogId] = useState(null);

  const { 
    data: dailySummary, 
    isLoading: isDailyLoading,
    error: dailyError
  } = useQuery({
    queryKey: HYDRATION_QUERY_KEYS.daily,
    queryFn: getDailyHydration,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
  });

  const { 
    data: history = [], 
    isLoading: isHistoryLoading,
    error: historyError
  } = useQuery({
    queryKey: HYDRATION_QUERY_KEYS.history,
    queryFn: getHydrationHistory,
    staleTime: 30000,
  });

  const {
    data: dailyTargets,
  } = useQuery({
    queryKey: NUTRITION_QUERY_KEYS.todayTargets,
    queryFn: getTodayDailyTargets,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const logWaterMutation = useMutation({
    mutationFn: (amount_ml) => logWater({ amount_ml }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.daily });
      queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.history });
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.all });
      toast.success('Water logged successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Failed to log water intake. Please try again.');
    }
  });

  const deleteWaterMutation = useMutation({
    mutationFn: (logId) => deleteWaterLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.daily });
      queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.history });
      queryClient.invalidateQueries({ queryKey: HABIT_QUERY_KEYS.all });
      setDeletingLogId(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Failed to delete water log. Please try again.');
      setDeletingLogId(null);
    }
  });

  const handleLogWater = async (amount_ml) => {
    await logWaterMutation.mutateAsync(amount_ml);
  };

  const handleDeleteLog = async (logId) => {
    setDeletingLogId(logId);
    await deleteWaterMutation.mutateAsync(logId);
  };

  if (dailyError || historyError) {
    const error = dailyError || historyError;
    
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Droplets className="mr-3 text-cyan-600" size={30} />
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Droplets className="mr-3 text-cyan-600" size={30} />
          Hydration Tracker
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor your daily water intake and stay hydrated
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <DailyTargetsCard
            targets={dailyTargets}
            title="Saved Daily Targets"
            description="Hydration progress uses the shared water goal saved in your daily targets so your intake percentage stays aligned with your nutrition plan."
            compact
          />

          <WaterProgressCard 
            dailySummary={dailySummary} 
            isLoading={isDailyLoading}
          />
          
          <WaterLogButtons 
            onLogWater={handleLogWater}
            isLogging={logWaterMutation.isPending}
          />
        </div>

        <div className="lg:col-span-2">
          <WaterHistoryList 
            history={history}
            onDeleteLog={handleDeleteLog}
            deletingLogId={deletingLogId}
            isLoading={isHistoryLoading}
          />
        </div>
      </div>

      <Card className="mt-8 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Lightbulb size={18} /> Hydration Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <Check size={16} className="mr-2 mt-0.5" />
            <span>Drink water regularly throughout the day, not just when you're thirsty</span>
          </li>
          <li className="flex items-start">
            <Check size={16} className="mr-2 mt-0.5" />
            <span>Start your day with a glass of water to kickstart your metabolism</span>
          </li>
          <li className="flex items-start">
            <Check size={16} className="mr-2 mt-0.5" />
            <span>Keep a water bottle with you to make drinking water more convenient</span>
          </li>
          <li className="flex items-start">
            <Check size={16} className="mr-2 mt-0.5" />
            <span>Increase water intake during exercise or hot weather</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}

export default Hydration;
