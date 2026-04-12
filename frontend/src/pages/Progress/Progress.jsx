import { useState } from 'react';
import { Check, Lightbulb, LineChart, Scale } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getWeightHistory,
  getWeeklySummary,
  logWeight,
  deleteWeightLog,
  PROGRESS_QUERY_KEYS
} from '../../services/progressService';

import WeightLogForm from '../../components/progress/WeightLogForm';
import WeeklySummaryCard from '../../components/progress/WeeklySummaryCard';
import WeightHistoryList from '../../components/progress/WeightHistoryList';
import WeightChart from '../../components/progress/WeightChart';

import ConsistencyOverview from '../../components/analytics/ConsistencyOverview';
import { Card, ErrorState } from '../../components/ui';

function Progress() {
  const queryClient = useQueryClient();
  const [deletingLogId, setDeletingLogId] = useState(null);

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

  const logWeightMutation = useMutation({
    mutationFn: (weightData) => logWeight(weightData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weightHistory });
      queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weeklySummary });
      toast.success('Weight logged successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Failed to log weight. Please try again.');
    }
  });

  const deleteWeightMutation = useMutation({
    mutationFn: (logId) => deleteWeightLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weightHistory });
      queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.weeklySummary });
      setDeletingLogId(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Failed to delete weight log. Please try again.');
      setDeletingLogId(null);
    }
  });

  const handleLogWeight = async (weightData) => {
    await logWeightMutation.mutateAsync(weightData);
  };

  const handleDeleteLog = async (logId) => {
    setDeletingLogId(logId);
    await deleteWeightMutation.mutateAsync(logId);
  };

  if (historyError || summaryError) {
    const error = historyError || summaryError;

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <LineChart className="mr-3 text-indigo-600" size={30} />
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <LineChart className="mr-3 text-indigo-600" size={30} />
          Progress & Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          Track your health journey with weight tracking and consistency analytics
        </p>
      </div>

      <div className="mb-8">
        <ConsistencyOverview days={30} />
      </div>

      <div className="border-t-2 border-gray-200 my-8"></div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Scale className="mr-3 text-indigo-600" size={26} />
          Weight Tracking
        </h2>
        <p className="text-gray-600 mt-1">
          Monitor your weight changes over time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 space-y-6">
          <WeightLogForm
            onSubmit={handleLogWeight}
            isLogging={logWeightMutation.isPending}
          />

          <WeeklySummaryCard
            summary={weeklySummary}
            isLoading={isSummaryLoading}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <WeightChart
            data={weightHistory}
            isLoading={isHistoryLoading}
          />

          <WeightHistoryList
            history={weightHistory}
            onDelete={handleDeleteLog}
            deletingLogId={deletingLogId}
            isLoading={isHistoryLoading}
          />
        </div>
      </div>

      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Lightbulb className="mr-2" size={18} />
          Weight Tracking Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="space-y-2">
            <div className="flex items-start">
              <Check className="mr-2 mt-1" size={16} />
              <div>
                <span className="font-semibold">Consistency is key:</span> Weigh yourself at the same time each day, preferably in the morning
              </div>
            </div>
            <div className="flex items-start">
              <Check className="mr-2 mt-1" size={16} />
              <div>
                <span className="font-semibold">Use the same scale:</span> Different scales can show different readings
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <Check className="mr-2 mt-1" size={16} />
              <div>
                <span className="font-semibold">Focus on trends:</span> Daily fluctuations are normal, look at weekly changes
              </div>
            </div>
            <div className="flex items-start">
              <Check className="mr-2 mt-1" size={16} />
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
