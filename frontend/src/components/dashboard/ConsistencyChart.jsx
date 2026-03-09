/**
 * ConsistencyChart Component
 * 
 * Displays consistency metrics for different logging activities:
 * - Food logging consistency
 * - Workout logging consistency
 * - Weight logging consistency
 * - Hydration logging consistency
 * 
 * Each shows a percentage with visual bar indicator
 * 
 * Props:
 * - consistency: {
 *     food_logging: { consistency_percentage },
 *     workout_logging: { consistency_percentage },
 *     weight_logging: { consistency_percentage },
 *     hydration_logging: { consistency_percentage }
 *   }
 */

function ConsistencyChart({ consistency }) {
  // Handle empty data
  if (!consistency) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Consistency</h3>
        <p className="text-gray-500 text-sm">No consistency data available</p>
      </div>
    );
  }

  // Consistency metrics configuration
  const metrics = [
    {
      name: 'Food Logging',
      icon: '🍽️',
      percentage: consistency.food_logging?.consistency_percentage || 0,
      color: 'bg-purple-500'
    },
    {
      name: 'Workout Logging',
      icon: '💪',
      percentage: consistency.workout_logging?.consistency_percentage || 0,
      color: 'bg-orange-500'
    },
    {
      name: 'Hydration Logging',
      icon: '💧',
      percentage: consistency.hydration_logging?.consistency_percentage || 0,
      color: 'bg-blue-500'
    },
    {
      name: 'Weight Logging',
      icon: '⚖️',
      percentage: consistency.weight_logging?.consistency_percentage || 0,
      color: 'bg-green-500'
    }
  ];

  // Calculate overall consistency
  const overallConsistency = (
    metrics.reduce((sum, metric) => sum + metric.percentage, 0) / metrics.length
  ).toFixed(1);

  // Determine consistency rating
  const getConsistencyRating = (percentage) => {
    if (percentage >= 80) return { text: 'Excellent', color: 'text-green-600' };
    if (percentage >= 60) return { text: 'Good', color: 'text-blue-600' };
    if (percentage >= 40) return { text: 'Fair', color: 'text-yellow-600' };
    return { text: 'Needs Improvement', color: 'text-red-600' };
  };

  const overallRating = getConsistencyRating(overallConsistency);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Consistency</h3>
      
      {/* Overall Score */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">Overall Score</p>
            <p className={`text-sm font-semibold ${overallRating.color}`}>
              {overallRating.text}
            </p>
          </div>
          <div className="text-3xl font-bold text-indigo-600">
            {overallConsistency}%
          </div>
        </div>
      </div>
      
      {/* Individual Metrics */}
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name}>
            {/* Metric Name and Percentage */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">
                {metric.icon} {metric.name}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {metric.percentage.toFixed(0)}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${metric.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${metric.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Motivational Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Track at least {metrics.length} days per week to improve consistency! 📊
        </p>
      </div>
    </div>
  );
}

export default ConsistencyChart;
