import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DASHBOARD_QUERY_KEY } from '../../services/dashboardService';
import { FOOD_QUERY_KEYS } from '../../services/foodService';
import { HYDRATION_QUERY_KEYS } from '../../services/hydrationService';
import {
  calculateDailyTargets,
  getNutritionProfile,
  getTodayDailyTargets,
  NUTRITION_QUERY_KEYS,
  saveCalculatedTargetsForToday,
  saveNutritionProfile,
} from '../../services/nutritionTargetsService';
import { parseErrorMessage } from '../../utils/validation';
import TargetCalculatorForm from '../../components/nutrition/TargetCalculatorForm';
import TargetSummaryCard from '../../components/nutrition/TargetSummaryCard';
import DailyTargetsCard from '../../components/nutrition/DailyTargetsCard';

function Nutrition() {
  const queryClient = useQueryClient();

  const {
    data: nutritionProfile,
    isLoading: isProfileLoading,
  } = useQuery({
    queryKey: NUTRITION_QUERY_KEYS.profile,
    queryFn: getNutritionProfile,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: todayTargets,
    isLoading: isTargetsLoading,
    refetch: refetchTodayTargets,
  } = useQuery({
    queryKey: NUTRITION_QUERY_KEYS.todayTargets,
    queryFn: getTodayDailyTargets,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const calculateTargetsMutation = useMutation({
    mutationFn: async (profileData) => {
      const savedProfile = await saveNutritionProfile(profileData, Boolean(nutritionProfile));
      const calculatedTargets = await calculateDailyTargets();

      return {
        savedProfile,
        calculatedTargets,
      };
    },
    onSuccess: ({ savedProfile, calculatedTargets }) => {
      queryClient.setQueryData(NUTRITION_QUERY_KEYS.profile, savedProfile);
      queryClient.setQueryData(NUTRITION_QUERY_KEYS.calculation, calculatedTargets);
    },
    onError: (error) => {
      alert(parseErrorMessage(error));
    },
  });

  const saveTargetsMutation = useMutation({
    mutationFn: saveCalculatedTargetsForToday,
    onSuccess: async (savedTargets) => {
      queryClient.setQueryData(NUTRITION_QUERY_KEYS.todayTargets, savedTargets);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.todayTargets }),
        queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.mealSummary }),
        queryClient.invalidateQueries({ queryKey: HYDRATION_QUERY_KEYS.daily }),
      ]);
      alert('Daily targets saved successfully.');
    },
    onError: (error) => {
      alert(parseErrorMessage(error));
    },
  });

  const calculatedTargets = calculateTargetsMutation.data?.calculatedTargets
    || queryClient.getQueryData(NUTRITION_QUERY_KEYS.calculation)
    || null;

  const handleCalculateTargets = async (profileData) => {
    await calculateTargetsMutation.mutateAsync(profileData);
  };

  const handleSaveTargets = async () => {
    if (!calculatedTargets) {
      return;
    }

    await saveTargetsMutation.mutateAsync(calculatedTargets);
    await refetchTodayTargets();
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">🎯</span>
          Nutrition Targets
        </h1>
        <p className="text-gray-600 mt-2">
          Calculate personalized calorie, macro, and hydration targets, then save them as the goal baseline used across your daily health tracking flows.
        </p>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm text-sky-900">
        React Query simplifies this workflow by treating the fitness profile, calculated recommendation, and saved daily targets as server state. That means loading, errors, cache invalidation, and background refetching stay consistent without hand-written state synchronization logic across multiple pages.
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-6 items-start">
        <div className="space-y-6">
          <TargetCalculatorForm
            initialValues={nutritionProfile}
            onSubmit={handleCalculateTargets}
            isSubmitting={calculateTargetsMutation.isPending || isProfileLoading}
          />
          <TargetSummaryCard
            calculatedTargets={calculatedTargets}
            onSave={handleSaveTargets}
            isSaving={saveTargetsMutation.isPending}
          />
        </div>

        <div className="space-y-6">
          <DailyTargetsCard
            targets={todayTargets}
            title="Current Daily Targets"
            description="These are the targets currently being consumed by the rest of the app. Updating them here keeps your dashboard, diary, and hydration tracker aligned on the same daily goals."
          />

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">How This Fits Across HealthOS</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Dashboard uses the saved targets to compute calorie remaining, macro progress, and hydration completion percentages.</p>
              <p>Diary can compare meal totals against the saved daily calorie and macro goals, which keeps food tracking tied to the same plan.</p>
              <p>Hydration uses the saved water target so logged water intake always measures against the current goal baseline.</p>
            </div>
          </div>
        </div>
      </div>

      {(isTargetsLoading && !todayTargets) && (
        <div className="text-sm text-slate-500">Loading saved daily targets...</div>
      )}
    </div>
  );
}

export default Nutrition;