/**
 * WeightCard Component
 * 
 * Displays weight tracking information:
 * - Latest weight
 * - Weekly change (with trend indicator)
 * 
 * Props:
 * - weight: { latest_weight, weekly_change }
 */

function WeightCard({ weight }) {
  // Handle empty data
  if (!weight || weight.latest_weight === null) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚖️ Weight</h3>
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No weight data available</p>
          <p className="text-xs text-gray-400 mt-2">Start tracking your weight!</p>
        </div>
      </div>
    );
  }

  const { 
    latest_weight = 0, 
    weekly_change = 0 
  } = weight;

  // Determine trend
  const isGain = weekly_change > 0;
  const isLoss = weekly_change < 0;
  const isStable = weekly_change === 0;

  // Trend colors and icons
  let trendColor = 'text-gray-600';
  let trendIcon = '➡️';
  let trendText = 'No change';
  let bgColor = 'bg-gray-50';

  if (isLoss) {
    trendColor = 'text-green-600';
    trendIcon = '📉';
    trendText = 'Weight loss';
    bgColor = 'bg-green-50';
  } else if (isGain) {
    trendColor = 'text-red-600';
    trendIcon = '📈';
    trendText = 'Weight gain';
    bgColor = 'bg-red-50';
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">⚖️ Weight</h3>
      
      {/* Current Weight Display */}
      <div className="text-center mb-4">
        <div className="text-5xl font-bold text-gray-900">
          {latest_weight}
        </div>
        <div className="text-sm text-gray-600 mt-1">kg</div>
      </div>
      
      {/* Weekly Change */}
      <div className={`${bgColor} rounded-lg p-3 mt-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{trendIcon}</span>
            <div>
              <p className="text-xs text-gray-600">Weekly Change</p>
              <p className={`text-sm font-medium ${trendColor}`}>
                {trendText}
              </p>
            </div>
          </div>
          <div className={`text-xl font-bold ${trendColor}`}>
            {weekly_change > 0 ? '+' : ''}{weekly_change} kg
          </div>
        </div>
      </div>
      
      {/* Motivational Text */}
      {isLoss && (
        <div className="mt-3 text-center text-xs text-green-600 font-medium">
          Keep up the great work! 💪
        </div>
      )}
      {isStable && (
        <div className="mt-3 text-center text-xs text-gray-600">
          Maintaining steady progress 👍
        </div>
      )}
    </div>
  );
}

export default WeightCard;
