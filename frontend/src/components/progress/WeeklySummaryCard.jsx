/**
 * WeeklySummaryCard Component
 * 
 * Displays weekly weight change summary with visual indicators.
 * 
 * Props:
 * - summary: { current_weight, week_ago_weight, change_kg, change_percentage }
 * - isLoading: boolean - shows skeleton loader
 * 
 * Features:
 * - Current weight display
 * - Weight change (kg and percentage)
 * - Visual indicators (up/down arrows)
 * - Color coding (green = loss, red = gain, gray = no change)
 * - Empty state handling
 */

function WeeklySummaryCard({ summary, isLoading }) {
  console.log('📊 WeeklySummaryCard props:', { summary, isLoading });
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Handle empty/no data state
  if (!summary || summary.current_weight === null || summary.current_weight === undefined) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📊 Weekly Summary
        </h3>
        <div className="text-center py-8">
          <div className="text-5xl mb-3">⚖️</div>
          <p className="text-gray-600 mb-2">No weight data yet</p>
          <p className="text-sm text-gray-500">
            Log your weight to see weekly progress
          </p>
        </div>
      </div>
    );
  }

  const {
    current_weight,
    week_ago_weight,
    change_kg,
    change_percentage
  } = summary || {};

  // Determine change direction and styling
  const hasChange = change_kg !== 0 && change_kg !== null;
  const isWeightLoss = change_kg < 0;
  const isWeightGain = change_kg > 0;

  // Get color classes based on change
  const getChangeColor = () => {
    if (!hasChange) return 'text-gray-600';
    return isWeightLoss ? 'text-green-600' : 'text-red-600';
  };

  const getChangeBgColor = () => {
    if (!hasChange) return 'bg-gray-100';
    return isWeightLoss ? 'bg-green-50' : 'bg-red-50';
  };

  const getArrowIcon = () => {
    if (!hasChange) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    if (isWeightLoss) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  };

  const getStatusMessage = () => {
    if (!hasChange) return 'Your weight is stable';
    if (isWeightLoss) return 'Great progress! Keep it up! 💪';
    return 'Weight increased this week';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        📊 Weekly Summary
      </h3>

      {/* Current Weight - Large Display */}
      <div className="text-center mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">Current Weight</div>
        <div className="text-5xl font-bold text-blue-600">
          {current_weight.toFixed(1)}
          <span className="text-2xl ml-2">kg</span>
        </div>
      </div>

      {/* Weekly Change Display */}
      <div className={`p-4 rounded-lg ${getChangeBgColor()} border-2 ${
        isWeightLoss ? 'border-green-200' : isWeightGain ? 'border-red-200' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-600 mb-1">7-Day Change</div>
            <div className={`text-2xl font-bold ${getChangeColor()} flex items-center`}>
              {getArrowIcon()}
              <span className="ml-2">
                {hasChange ? Math.abs(change_kg).toFixed(1) : '0.0'} kg
              </span>
            </div>
            <div className={`text-sm font-semibold ${getChangeColor()} mt-1`}>
              {hasChange ? `${change_percentage > 0 ? '+' : ''}${change_percentage.toFixed(2)}%` : '0.00%'}
            </div>
          </div>

          {/* Visual Emoji Indicator */}
          <div className="text-5xl">
            {!hasChange && '😊'}
            {isWeightLoss && '🎉'}
            {isWeightGain && '📈'}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700 text-center font-medium">
          {getStatusMessage()}
        </p>
      </div>

      {/* Comparison Details */}
      {week_ago_weight && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Weight 7 days ago:</span>
            <span className="font-semibold text-gray-900">
              {week_ago_weight.toFixed(1)} kg
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklySummaryCard;
