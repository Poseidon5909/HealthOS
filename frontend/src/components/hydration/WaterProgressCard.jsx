/**
 * WaterProgressCard Component
 * 
 * Displays daily water intake progress with:
 * - Total consumed water (ml)
 * - Daily target water (ml)
 * - Remaining water needed
 * - Visual progress bar
 * - Progress percentage
 * 
 * Props:
 * - dailySummary: { water_target_ml, total_consumed_ml, remaining_ml, progress_percentage }
 * - isLoading: boolean (optional) - shows skeleton loader
 */

function WaterProgressCard({ dailySummary, isLoading }) {
  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Handle empty data
  if (!dailySummary) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💧 Daily Water Progress</h3>
        <p className="text-gray-500 text-sm">No hydration data available</p>
      </div>
    );
  }

  const { 
    water_target_ml = 0, 
    total_consumed_ml = 0, 
    remaining_ml = 0, 
    progress_percentage = 0 
  } = dailySummary;

  // Calculate glasses (assuming 250ml per glass)
  const glassesConsumed = (total_consumed_ml / 250).toFixed(1);
  const glassesTarget = (water_target_ml / 250).toFixed(1);

  // Progress bar color based on completion
  const getProgressColor = () => {
    if (progress_percentage >= 100) return 'bg-green-500';
    if (progress_percentage >= 75) return 'bg-blue-500';
    if (progress_percentage >= 50) return 'bg-blue-400';
    return 'bg-blue-300';
  };

  // Status message
  const getStatusMessage = () => {
    if (progress_percentage >= 100) {
      return '🎉 Great job! You\'ve reached your hydration goal!';
    }
    if (progress_percentage >= 75) {
      return '💪 Almost there! Keep it up!';
    }
    if (progress_percentage >= 50) {
      return '👍 Good progress! Stay hydrated!';
    }
    return '💧 Start drinking water to reach your goal!';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">💧 Daily Water Progress</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          progress_percentage >= 100 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {progress_percentage.toFixed(0)}%
        </span>
      </div>
      
      {/* Main Display - Large Numbers */}
      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {total_consumed_ml} ml
          </div>
          <div className="text-sm text-gray-600">
            of {water_target_ml} ml daily goal
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ({glassesConsumed} of {glassesTarget} glasses)
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`${getProgressColor()} h-4 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(progress_percentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Status Message */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 text-center font-medium">
          {getStatusMessage()}
        </p>
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Consumed</div>
          <div className="text-lg font-bold text-gray-900">{total_consumed_ml} ml</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Remaining</div>
          <div className={`text-lg font-bold ${
            remaining_ml > 0 ? 'text-orange-600' : 'text-green-600'
          }`}>
            {remaining_ml > 0 ? `${remaining_ml} ml` : 'Goal reached! 🎉'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaterProgressCard;
