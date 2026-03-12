import React from 'react';

/**
 * HabitStatusCard Component (Day 12)
 * 
 * Displays today's completion status for a single habit.
 * 
 * Props:
 * @param {string} title - Habit display name (e.g., "Hydration Goal")
 * @param {string} description - What the habit tracks
 * @param {string} icon - Emoji for visual identification
 * @param {boolean} isComplete - Whether habit is completed today
 * @param {boolean} isLoading - Loading state
 * @param {string} completionText - Text to show when complete
 * @param {string} incompleteText - Text to show when not complete
 * 
 * Visual Design Philosophy:
 * - Green checkmark: Success feedback (dopamine trigger)
 * - Red X: Creates urgency to complete
 * - Clear typography: Easy to scan at a glance
 * - Hover effects: Interactive feel
 * - Smooth animations: Modern, polished UX
 * 
 * Why visual indicators matter:
 * 1. Instant recognition - no reading required
 * 2. Color psychology - green = good, red = needs action
 * 3. Gamification - completing feels like "winning"
 * 4. Status clarity - reduces cognitive load
 * 5. Motivation - visual progress triggers habit formation
 */

function HabitStatusCard({ 
  title, 
  description, 
  icon, 
  isComplete, 
  isLoading = false,
  completionText = "Completed today!",
  incompleteText = "Not completed yet"
}) {

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        rounded-lg shadow-md p-6 border-2 transition-all duration-300 hover:shadow-lg
        ${isComplete 
          ? 'bg-green-50 border-green-300' 
          : 'bg-white border-gray-300 hover:border-gray-400'
        }
      `}
    >
      <div className="flex items-center justify-between">
        {/* Left side: Habit info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          
          {/* Status text */}
          <div className="flex items-center gap-2">
            {isComplete ? (
              <>
                <span className="text-green-600 font-medium text-sm">✓</span>
                <span className="text-green-700 font-medium text-sm">{completionText}</span>
              </>
            ) : (
              <>
                <span className="text-gray-400 font-medium text-sm">○</span>
                <span className="text-gray-600 text-sm">{incompleteText}</span>
              </>
            )}
          </div>
        </div>

        {/* Right side: Visual indicator */}
        <div className="ml-4">
          {isComplete ? (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-white text-3xl font-bold">✓</span>
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-3xl font-bold">×</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            isComplete ? 'bg-green-500' : 'bg-gray-300'
          }`}
          style={{ width: isComplete ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
}

export default HabitStatusCard;
