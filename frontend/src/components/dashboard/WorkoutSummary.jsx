import { memo } from 'react';
import { Card } from '../ui';

/**
 * WorkoutSummary Component
 * 
 * Displays today's workout activity summary:
 * - Calories burned
 * - Duration in minutes
 * 
 * Props:
 * - workout: { calories_burned, duration_minutes }
 */

function WorkoutSummary({ workout }) {
  // Handle empty data
  if (!workout) {
    return (
      <Card hoverable>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Workout</h3>
        <p className="text-gray-500 text-sm">No workout data available</p>
      </Card>
    );
  }

  const { 
    calories_burned = 0, 
    duration_minutes = 0 
  } = workout;

  // Check if user worked out today
  const hasWorkedOut = calories_burned > 0 || duration_minutes > 0;

  // Format duration
  const hours = Math.floor(duration_minutes / 60);
  const minutes = duration_minutes % 60;
  const durationText = hours > 0 
    ? `${hours}h ${minutes}m` 
    : `${minutes}m`;

  return (
    <Card hoverable>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Workout</h3>
        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">💪 Activity</span>
      </div>
      
      {hasWorkedOut ? (
        <>
          {/* Workout Stats */}
          <div className="space-y-4">
            {/* Calories Burned */}
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-xs text-gray-600">Calories Burned</p>
                  <p className="text-2xl font-bold text-orange-600">{calories_burned}</p>
                </div>
              </div>
            </div>
            
            {/* Duration */}
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="text-2xl font-bold text-indigo-600">{durationText}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Motivational Message */}
          <div className="mt-4 text-center text-sm text-green-600 font-medium">
            💪 Great job today!
          </div>
        </>
      ) : (
        /* No Workout Yet */
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🏃‍♂️</div>
          <p className="text-gray-600 text-sm">No workouts logged today</p>
          <p className="text-gray-500 text-xs mt-2">Time to get moving!</p>
        </div>
      )}
    </Card>
  );
}

export default memo(WorkoutSummary);
