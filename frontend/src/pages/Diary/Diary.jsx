import { useState } from 'react';
import { BookOpenText, Search, Utensils } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { searchFoods, getTodayFoodLogs, getTodayMealSummary, logFood, updateFoodLog, deleteFoodLog, FOOD_QUERY_KEYS } from '../../services/foodService';
import { getTodayDailyTargets, NUTRITION_QUERY_KEYS } from '../../services/nutritionTargetsService';
import { Card, ErrorState, Loader, Skeleton } from '../../components/ui';
import FoodSearchBar from '../../components/food/FoodSearchBar';
import FoodSearchResults from '../../components/food/FoodSearchResults';
import FoodLogForm from '../../components/food/FoodLogForm';
import EditFoodLogModal from '../../components/food/EditFoodLogModal';
import FoodLogList from '../../components/food/FoodLogList';
import DailyTargetsCard from '../../components/nutrition/DailyTargetsCard';

function Diary() {
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [editingLog, setEditingLog] = useState(null);
  const [targetMealType, setTargetMealType] = useState('breakfast');

  const { data: dailyTargets } = useQuery({
    queryKey: NUTRITION_QUERY_KEYS.todayTargets,
    queryFn: getTodayDailyTargets,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const {
    data: todayLogs = [],
    isLoading: isLoadingLogs,
    isError: isErrorLogs,
    error: logsError
  } = useQuery({
    queryKey: FOOD_QUERY_KEYS.todayLogs,
    queryFn: getTodayFoodLogs,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true
  });

  const {
    data: mealSummary = {},
    isLoading: isLoadingSummary
  } = useQuery({
    queryKey: FOOD_QUERY_KEYS.mealSummary,
    queryFn: getTodayMealSummary,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true
  });

  const {
    data: searchResults,
    isLoading: isSearching,
    isError: isSearchError,
    error: searchError
  } = useQuery({
    queryKey: FOOD_QUERY_KEYS.search(searchQuery),
    queryFn: () => searchFoods(searchQuery),
    enabled: searchQuery.length > 0, // Only search when query exists
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  const logFoodMutation = useMutation({
    mutationFn: logFood,
    onSuccess: () => {
      setSelectedFood(null);
      
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.todayLogs });
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.mealSummary });
      
      toast.success('Food logged successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Failed to log food');
    }
  });

  const updateFoodMutation = useMutation({
    mutationFn: ({ logId, data }) => updateFoodLog(logId, data),
    onSuccess: () => {
      setEditingLog(null);
      
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.todayLogs });
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.mealSummary });

      toast.success('Food log updated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Failed to update food log');
    }
  });

  const deleteFoodMutation = useMutation({
    mutationFn: deleteFoodLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.todayLogs });
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.mealSummary });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Failed to delete food');
    }
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
  };

  const handleAddFoodToMeal = (mealType) => {
    setTargetMealType(mealType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogFood = (logData) => {
    logFoodMutation.mutate(logData);
  };

  const handleDeleteLog = (logId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteFoodMutation.mutate(logId);
    }
  };

  const handleEditLog = (foodLog) => {
    setEditingLog(foodLog);
  };

  const handleUpdateLog = (updateData) => {
    updateFoodMutation.mutate({
      logId: editingLog.id,
      data: updateData
    });
  };

  const handleCancelEdit = () => {
    setEditingLog(null);
  };

  const handleCancelForm = () => {
    setSelectedFood(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BookOpenText className="mr-3 text-indigo-600" size={30} />
          Food Diary
        </h1>
        <p className="text-gray-600 mt-2">
          Track your daily meals and nutrition - {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <DailyTargetsCard
        targets={dailyTargets}
        title="Nutrition Goal Baseline"
        description="Your diary uses these centralized daily calorie and macro targets as the comparison baseline for meal logging and nutrition progress." 
        compact
      />

      <Card className="mb-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search size={20} className="text-indigo-600" /> Search Foods
        </h2>
        <FoodSearchBar onSearch={handleSearch} isLoading={isSearching} />
        
        {searchQuery && (
          <FoodSearchResults
            foods={searchResults?.items || []}
            isLoading={isSearching}
            isError={isSearchError}
            error={searchError}
            onSelectFood={handleSelectFood}
          />
        )}
      </Card>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Utensils size={20} className="text-indigo-600" /> Today's Meals
          </h2>
          {!isLoadingLogs && todayLogs.length > 0 && (
            <span className="text-sm text-gray-600">
              {todayLogs.length} {todayLogs.length === 1 ? 'entry' : 'entries'} logged
            </span>
          )}
        </div>

        {isLoadingLogs ? (
          <Card>
            <Loader label="Loading your meals..." />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </div>
          </Card>
        ) : isErrorLogs ? (
          <ErrorState title="Error loading today's meals" error={logsError} onRetry={() => queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.todayLogs })} />
        ) : (
          <FoodLogList
            foodLogs={todayLogs}
            mealSummary={mealSummary}
            onDeleteLog={handleDeleteLog}
            onEditLog={handleEditLog}
            onAddFood={handleAddFoodToMeal}
          />
        )}
      </div>

      {selectedFood && (
        <FoodLogForm
          food={selectedFood}
          onSubmit={handleLogFood}
          onCancel={handleCancelForm}
          isSubmitting={logFoodMutation.isPending}
        />
      )}

      {editingLog && (
        <EditFoodLogModal
          foodLog={editingLog}
          onSubmit={handleUpdateLog}
          onCancel={handleCancelEdit}
          isSubmitting={updateFoodMutation.isPending}
        />
      )}
    </div>
  );
}

export default Diary;
