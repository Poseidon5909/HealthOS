import { memo } from 'react';
import { Target, ThumbsUp, Trophy, Zap } from 'lucide-react';
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
  const getFeedback = () => {
    if (percentage >= 90) {
      return {
        icon: <Trophy size={14} className="text-emerald-600" />,
        text: 'Excellent consistency!'
      };
    }
    if (percentage >= 70) {
      return {
        icon: <ThumbsUp size={14} className="text-blue-600" />,
        text: 'Great job! Keep it up!'
      };
    }
    if (percentage >= 50) {
      return {
        icon: <Zap size={14} className="text-amber-600" />,
        text: 'Good start, aim higher!'
      };
    }
    return {
      icon: <Target size={14} className="text-red-600" />,
      text: "Let's improve tracking!"
    };
  };

  const feedback = getFeedback();
  
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </div>

      <div className="mb-4">
        <div className={`text-4xl font-bold ${getPercentageColor()}`}>
          {percentage.toFixed(1)}%
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Consistency Score
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{daysLogged}</span> out of{' '}
          <span className="font-semibold">{totalDays}</span> days tracked
        </p>
      </div>

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

      <ConsistencyChart percentage={percentage} size={80} />

      <div className="mt-4 text-xs text-gray-600 italic flex items-center gap-2">
        {feedback.icon}
        {feedback.text}
      </div>
    </div>
  );
}

export default memo(ConsistencyCard);
