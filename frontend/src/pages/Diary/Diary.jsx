import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchFoods, getTodayFoodLogs, getTodayMealSummary, logFood, updateFoodLog, deleteFoodLog, FOOD_QUERY_KEYS } from '../../services/foodService';
import { getTodayDailyTargets, NUTRITION_QUERY_KEYS } from '../../services/nutritionTargetsService';
import FoodSearchBar from '../../components/food/FoodSearchBar';
import FoodSearchResults from '../../components/food/FoodSearchResults';
import FoodLogForm from '../../components/food/FoodLogForm';
import EditFoodLogModal from '../../components/food/EditFoodLogModal';
import FoodLogList from '../../components/food/FoodLogList';
import DailyTargetsCard from '../../components/nutrition/DailyTargetsCard';

/**
 * Diary Page
 * 
 * Main food tracking interface:
 * - Search and select foods
 * - Log food consumption
 * - View today's meals organized by type
 */
function Diary() {
  const queryClient = useQueryClient();
  
  // State management
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

  // Fetch today's food logs
  const {
    data: todayLogs = [],
    isLoading: isLoadingLogs,
    isError: isErrorLogs
  } = useQuery({
    queryKey: FOOD_QUERY_KEYS.todayLogs,
    queryFn: getTodayFoodLogs,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true
  });

  // Fetch today's meal summaries
  const {
    data: mealSummary = {},
    isLoading: isLoadingSummary
  } = useQuery({
    queryKey: FOOD_QUERY_KEYS.mealSummary,
    queryFn: getTodayMealSummary,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true
  });

  // Search foods
  const {
    data: searchResults,
    isLoading: isSearching,
    isError: isSearchError
  } = useQuery({
    queryKey: FOOD_QUERY_KEYS.search(searchQuery),
    queryFn: () => searchFoods(searchQuery),
    enabled: searchQuery.length > 0, // Only search when query exists
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  // Mutation: Log food
  const logFoodMutation = useMutation({
    mutationFn: logFood,
    onSuccess: () => {
      // Close the form
      setSelectedFood(null);
      
      // Invalidate and refetch today's logs AND meal summary
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.todayLogs });
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.mealSummary });
      
      // Show success message (optional)
      alert('✅ Food added successfully!');
    },
    onError: (error) => {
      alert(`❌ Error: ${error.response?.data?.detail || 'Failed to log food'}`);
    }
  });

  // Mutation: Update food log
  const updateFoodMutation = useMutation({
    mutationFn: ({ logId, data }) => updateFoodLog(logId, data),
    onSuccess: () => {
      // Close the edit modal
      setEditingLog(null);
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.todayLogs });
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.mealSummary });
      
      alert('✅ Food log updated successfully!');
    },
    onError: (error) => {
      alert(`❌ Error: ${error.response?.data?.detail || 'Failed to update food log'}`);
    }
  });

  // Mutation: Delete food log
  const deleteFoodMutation = useMutation({
    mutationFn: deleteFoodLog,
    onSuccess: () => {
      // Refetch today's logs AND meal summary
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.todayLogs });
      queryClient.invalidateQueries({ queryKey: FOOD_QUERY_KEYS.mealSummary });
    },
    onError: (error) => {
      alert(`❌ Error: ${error.response?.data?.detail || 'Failed to delete food'}`);
    }
  });

  // Handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
  };

  const handleAddFoodToMeal = (mealType) => {
    // When user clicks "Add Food" in a meal section
    // We can open a food search modal or scroll to search
    setTargetMealType(mealType);
    // Scroll to search bar
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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">📔</span>
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

      {/* Food Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 Search Foods</h2>
        <FoodSearchBar onSearch={handleSearch} isLoading={isSearching} />
        
        {searchQuery && (
          <FoodSearchResults
            foods={searchResults?.items || []}
            isLoading={isSearching}
            isError={isSearchError}
            onSelectFood={handleSelectFood}
          />
        )}
      </div>

      {/* Today's Meals Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">📊 Today's Meals</h2>
          {!isLoadingLogs && todayLogs.length > 0 && (
            <span className="text-sm text-gray-600">
              {todayLogs.length} {todayLogs.length === 1 ? 'entry' : 'entries'} logged
            </span>
          )}
        </div>

        {isLoadingLogs ? (
          <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading your meals...</p>
            </div>
          </div>
        ) : isErrorLogs ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Meals</h3>
            <p className="text-red-600">Unable to load today's food logs. Please try again.</p>
          </div>
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

      {/* Food Log Form Modal */}
      {selectedFood && (
        <FoodLogForm
          food={selectedFood}
          onSubmit={handleLogFood}
          onCancel={handleCancelForm}
          isSubmitting={logFoodMutation.isPending}
        />
      )}

      {/* Edit Food Log Modal */}
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
