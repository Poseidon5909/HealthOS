import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { normalizeEmojiText } from '../../constants/icons';

/**
 * HabitStreakCard Component (Day 12)
 * 
 * Displays consecutive days of habit completion (streak).
 * 
 * Props:
 * @param {string} title - Habit name
 * @param {string} icon - Emoji representation
 * @param {number} streak - Current streak count (days)
 * @param {boolean} isLoading - Loading state
 * @param {string} color - Theme color (green, blue, purple, orange)
 * 
 * Psychology of Streaks:
 * 1. **Gamification** - Makes tracking fun and engaging
 * 2. **Loss Aversion** - Fear of "breaking the streak" motivates continuation
 * 3. **Visual Progress** - Easy to see improvement over time
 * 4. **Social Proof** - Can share achievements with others
 * 5. **Habit Loop** - Streak -> Dopamine -> Reinforcement -> Repeat
 * 
 * Why streaks work:
 * Research shows that visible progress indicators increase
 * habit adherence by 42%. The "don't break the chain" method
 * was popularized by Jerry Seinfeld for daily comedy writing.
 * 
 * Color coding by achievement level:
 * - 0 days: Gray (neutral, starting point)
 * - 1-6 days: Blue (building momentum)
 * - 7-13 days: Green (one week milestone!)
 * - 14-29 days: Purple (two weeks - habit forming)
 * - 30+ days: Gold (mastery level!)
 */

function HabitStreakCard({ 
  title, 
  icon, 
  streak = 0, 
  isLoading = false,
  color = 'blue'
}) {
  const displayIcon = normalizeEmojiText(icon);

  /**
   * Determine visual styling based on streak length
   * Longer streaks = more impressive presentation
   */
  const getStreakLevel = () => {
    if (streak === 0) return { level: 'none', text: 'Start your streak!', bgColor: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-300' };
    if (streak < 7) return { level: 'building', text: 'Building momentum', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-300' };
    if (streak < 14) return { level: 'week', text: 'One week streak!', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-300' };
    if (streak < 30) return { level: 'habit', text: 'Habit forming!', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-300' };
    return { level: 'master', text: 'Master level!', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-400' };
  };

  const streakLevel = getStreakLevel();

  /**
   * Get flame emoji based on streak intensity
   * Visual metaphor: Bigger fire = hotter streak!
   */
  const getFlameEmoji = () => {
    if (streak === 0) {
      return <span className="text-gray-400">-</span>;
    }
    if (streak < 30) {
      return <Flame size={22} className="text-orange-500" />;
    }
    return (
      <span className="inline-flex items-center gap-1">
        <Flame size={22} className="text-orange-500" />
        <Sparkles size={18} className="text-yellow-400" />
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div 
      className={`
        rounded-lg shadow-md p-6 border-2 transition-all duration-300 hover:shadow-lg
        ${streakLevel.bgColor} ${streakLevel.borderColor}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{displayIcon}</span>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        <span className="text-2xl">{getFlameEmoji()}</span>
      </div>

      <div className="mb-2">
        <div className={`text-5xl font-bold ${streakLevel.textColor} leading-none`}>
          {streak}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {streak === 1 ? 'day' : 'days'}
        </div>
      </div>

      <div className={`text-sm font-medium ${streakLevel.textColor}`}>
        {streakLevel.text}
      </div>

      {streak > 0 && streak < 30 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Current</span>
            <span>
              {streak < 7 && 'Next: 7 days'}
              {streak >= 7 && streak < 14 && 'Next: 14 days'}
              {streak >= 14 && streak < 30 && 'Next: 30 days'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full ${
                streak < 7 ? 'bg-blue-500' :
                streak < 14 ? 'bg-green-500' :
                'bg-purple-500'
              } transition-all duration-500`}
              style={{ 
                width: `${
                  streak < 7 ? (streak / 7) * 100 :
                  streak < 14 ? ((streak - 7) / 7) * 100 :
                  ((streak - 14) / 16) * 100
                }%` 
              }}
            />
          </div>
        </div>
      )}

      {streak >= 30 && (
        <div className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center py-2 px-4 rounded-lg font-bold text-sm shadow-md inline-flex items-center justify-center gap-2 w-full">
          <Sparkles size={16} /> MASTER STATUS ACHIEVED <Sparkles size={16} />
        </div>
      )}
    </div>
  );
}

export default HabitStreakCard;
