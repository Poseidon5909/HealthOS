import { memo } from 'react';
import ConsistencyChart from './ConsistencyChart';

/**
 * ConsistencyCard Component (Day 11)
 * 
 * Displays individual consistency metric with:
 * - Category name and icon
 * - Consistency percentage (color-coded)
 * - Days logged vs total days
 * - Visual progress indicator (chart)
 * 
 * Props:
 * @param {string} title - Category display name (e.g., "Food Logging")
 * @param {string} icon - Emoji or icon to represent category
 * @param {number} daysLogged - Number of days tracked
 * @param {number} totalDays - Total days in period
 * @param {number} percentage - Consistency percentage (0-100)
 * @param {string} color - Tailwind color class for theming
 * 
 * Color-coding for motivation:
 * - Green (90%+): Excellent consistency
 * - Blue (70-89%): Good consistency
 * - Yellow (50-69%): Needs improvement
 * - Red (<50%): Critical - needs attention
 * 
 * Why modular card design works:
 * 1. Reusable across different analytics views
 * 2. Easy to maintain and update styling
 * 3. Consistent user experience
 * 4. Simple to test individual metrics
 * 5. Scalable for adding new categories
 */

function ConsistencyCard({ 
  title, 
  icon, 
  daysLogged, 
  totalDays, 
  percentage,
  color = 'blue' 
}) {
  
  /**
   * Determine color class based on percentage
   * Visual feedback improves user engagement
   */
  const getColorClass = () => {
    if (percentage >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getPercentageColor = () => {
    if (percentage >= 90) return 'text-green-700';
    if (percentage >= 70) return 'text-blue-700';
    if (percentage >= 50) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getProgressBarColor = () => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getColorClass()} transition-all duration-300 hover:shadow-lg`}>
      {/* Header with icon and title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </div>

      {/* Consistency percentage - main metric */}
      <div className="mb-4">
        <div className={`text-4xl font-bold ${getPercentageColor()}`}>
          {percentage.toFixed(1)}%
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Consistency Score
        </p>
      </div>

      {/* Days logged information */}
      <div className="mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{daysLogged}</span> out of{' '}
          <span className="font-semibold">{totalDays}</span> days tracked
        </p>
      </div>

      {/* Visual progress bar */}
      <div className="mb-4">
        <div
          className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
          role="progressbar"
          aria-label={`${title} consistency`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percentage)}
        >
          <div 
            className={`h-full ${getProgressBarColor()} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Consistency chart visualization */}
      <ConsistencyChart percentage={percentage} size={80} />

      {/* Motivational message based on performance */}
      <div className="mt-4 text-xs text-gray-600 italic">
        {percentage >= 90 && "🎉 Excellent consistency!"}
        {percentage >= 70 && percentage < 90 && "👍 Great job! Keep it up!"}
        {percentage >= 50 && percentage < 70 && "💪 Good start, aim higher!"}
        {percentage < 50 && "🎯 Let's improve tracking!"}
      </div>
    </div>
  );
}

export default memo(ConsistencyCard);
