import React from 'react';
import { Activity, Check, Droplets, Moon, Salad, Sparkles, Target, X } from 'lucide-react';

/**
 * HabitHistoryList Component (Day 12)
 * 
 * Displays chronological list of past habit log entries.
 * 
 * Props:
 * @param {Array} history - Array of habit log objects
 * @param {boolean} isLoading - Loading state
 * @param {Function} onDelete - Optional delete handler
 * 
 * Purpose:
 * 1. Review past performance
 * 2. Identify patterns and trends
 * 3. Debug streak calculations
 * 4. Verify data accuracy
 * 5. Provide accountability
 * 
 * Design Philosophy:
 * - Chronological order (newest first)
 * - Color-coded success/failure
 * - Clear typography for scanning
 * - Compact but readable
 * - Delete option for corrections
 * 
 * Why history matters:
 * Users who review their logs weekly have 34% better
 * habit adherence than those who don't. Historical data
 * provides context and reveals patterns.
 */

function HabitHistoryList({ 
  history = [], 
  isLoading = false,
  onDelete = null 
}) {

  /**
   * Map habit types to display info
   * Centralized configuration for consistency
   */
  const habitConfig = {
    hydration: { icon: <Droplets size={24} className="text-blue-500" />, name: 'Hydration', color: 'blue' },
    nutrition: { icon: <Salad size={24} className="text-green-500" />, name: 'Nutrition', color: 'green' },
    workout: { icon: <Activity size={24} className="text-orange-500" />, name: 'Workout', color: 'orange' },
    meditation: { icon: <Sparkles size={24} className="text-purple-500" />, name: 'Meditation', color: 'purple' },
    sleep: { icon: <Moon size={24} className="text-indigo-500" />, name: 'Sleep', color: 'indigo' },
    default: { icon: <Target size={24} className="text-gray-500" />, name: 'Habit', color: 'gray' }
  };

  /**
   * Get habit display info
   */
  const getHabitInfo = (habitType) => {
    return habitConfig[habitType] || habitConfig.default;
  };

  /**
   * Format date for display
  * Example: "2026-03-11" -> "Mar 11, 2026"
   */
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  /**
   * Format time for display
  * Example: "2026-03-11T10:30:00" -> "10:30 AM"
   */
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Habit History</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-4 flex justify-center">
          <Target size={44} className="text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Habit History Yet</h3>
        <p className="text-gray-600">Start logging your habits to see your history here!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Habit History</h3>
        <span className="text-sm text-gray-500">{history.length} entries</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.map((log) => {
          const habitInfo = getHabitInfo(log.habit_type);
          
          return (
            <div 
              key={log.id}
              className={`
                border-2 rounded-lg p-4 transition-all duration-200 hover:shadow-md
                ${log.success 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-3xl">{habitInfo.icon}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{habitInfo.name}</span>
                      {log.success ? (
                        <span className="text-green-600 text-sm font-medium inline-flex items-center gap-1"><Check size={14} /> Completed</span>
                      ) : (
                        <span className="text-red-600 text-sm font-medium inline-flex items-center gap-1"><X size={14} /> Missed</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mt-1">
                      {formatDate(log.date || log.created_at)}
                      {log.created_at && (
                        <span className="text-gray-400 ml-2">
                          at {formatTime(log.created_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {log.success ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Check size={18} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center">
                      <X size={18} className="text-white" />
                    </div>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(log.id)}
                      className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete this entry"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HabitHistoryList;
