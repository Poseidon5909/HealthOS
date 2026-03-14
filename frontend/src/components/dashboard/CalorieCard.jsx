import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui';

/**
 * CalorieCard Component
 * 
 * Displays daily calorie consumption summary with:
 * - Calories consumed
 * - Calories remaining
 * - Target calories
 * - Visual progress bar
 * 
 * Props:
 * - calories: { target, consumed, remaining }
 */

function CalorieCard({ calories }) {
  // Handle empty data
  if (!calories) {
    return (
      <Card hoverable>
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Calorie Balance</h3>
        <p className="text-gray-500 text-sm">No calorie data available</p>
      </Card>
    );
  }

  const { target = 0, consumed = 0, remaining = 0 } = calories;
  
  // Calculate progress percentage
  const progressPercentage = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
  
  // Determine color based on remaining calories
  const isOverTarget = remaining < 0;
  const remainingColor = isOverTarget ? 'text-red-600' : 'text-green-600';
  const progressBarColor = isOverTarget ? 'bg-red-500' : 'bg-indigo-600';

  return (
    <Card hoverable>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Calorie Balance</h3>
        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">🔥 Daily</span>
      </div>
      
      {/* Main Stats */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Consumed</span>
          <span className="text-xl font-bold text-gray-900">{consumed}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Target</span>
          <span className="text-lg text-gray-700">{target}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Remaining</span>
          <span className={`text-lg font-semibold ${remainingColor}`}>
            {isOverTarget ? `+${Math.abs(remaining)}` : remaining}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div
          className="w-full bg-gray-200 rounded-full h-3"
          role="progressbar"
          aria-label="Calorie goal progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPercentage)}
        >
          <motion.div
            className={`${progressBarColor} h-3 rounded-full transition-all duration-500`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {progressPercentage.toFixed(0)}% of daily goal
        </p>
      </div>
    </Card>
  );
}

export default memo(CalorieCard);
