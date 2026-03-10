import { format, parseISO } from 'date-fns';

/**
 * WeightHistoryList Component
 * 
 * Displays list of weight log entries with delete functionality.
 * 
 * Props:
 * - history: Array of weight log objects (sorted newest first for display)
 * - onDelete: function(logId) - callback when delete button is clicked
 * - deletingLogId: number - ID of the log currently being deleted
 * - isLoading: boolean - shows loading state
 * 
 * Features:
 * - Displays weight, date, and time
 * - Shows weight change from previous entry
 * - Delete functionality with confirmation
 * - Empty state
 * - Loading skeleton
 */

function WeightHistoryList({ history = [], onDelete, deletingLogId = null, isLoading = false }) {
  console.log('📜 WeightHistoryList props:', { historyLength: history?.length, onDelete: !!onDelete, deletingLogId, isLoading });
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Weight History</h3>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Weight History</h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚖️</div>
          <p className="text-gray-600 mb-2">No weight logs yet</p>
          <p className="text-sm text-gray-500">Start tracking your weight above</p>
        </div>
      </div>
    );
  }

  // Sort history by date (newest first for display)
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Calculate weight change from previous entry
  const getWeightChange = (index) => {
    if (index === sortedHistory.length - 1) return null; // First entry (oldest), no previous
    
    const current = sortedHistory[index].weight;
    const previous = sortedHistory[index + 1].weight;
    const change = current - previous;
    
    return {
      value: change,
      isIncrease: change > 0,
      isDecrease: change < 0
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">📋 Weight History</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          {history.length} entr{history.length !== 1 ? 'ies' : 'y'}
        </span>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {sortedHistory.map((log, index) => {
          const change = getWeightChange(index);
          const isDeleting = deletingLogId === log.id;
          
          return (
            <WeightHistoryItem
              key={log.id}
              log={log}
              change={change}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          );
        })}
      </div>

      {/* Summary Footer */}
      {history.length > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total entries:</span>
              <span className="ml-2 font-bold text-gray-900">{history.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Latest:</span>
              <span className="ml-2 font-bold text-blue-600">
                {sortedHistory[0].weight.toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * WeightHistoryItem - Individual history entry
 */
function WeightHistoryItem({ log, change, onDelete, isDeleting }) {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const logDate = parseISO(log.date);
  const formattedDate = format(logDate, 'MMM d, yyyy');
  const dayOfWeek = format(logDate, 'EEEE');

  const handleDelete = () => {
    onDelete(log.id);
    setShowConfirm(false);
  };

  return (
    <div className={`
      border rounded-lg p-4 transition-all duration-200
      ${isDeleting ? 'opacity-50 animate-pulse' : 'hover:shadow-md hover:border-blue-300'}
    `}>
      <div className="flex items-center justify-between">
        {/* Left - Weight */}
        <div className="flex items-center space-x-4">
          <div className="text-4xl">⚖️</div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {log.weight.toFixed(1)}
              </span>
              <span className="text-gray-600">kg</span>
              
              {/* Weight Change Badge */}
              {change && change.value !== 0 && (
                <span className={`
                  text-xs font-semibold px-2 py-1 rounded-full
                  ${change.isDecrease 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  }
                `}>
                  {change.isDecrease ? '↓' : '↑'} {Math.abs(change.value).toFixed(1)} kg
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {dayOfWeek}
            </div>
          </div>
        </div>

        {/* Right - Date and Actions */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="font-semibold text-gray-900 text-sm">
              {formattedDate}
            </div>
            <div className="text-xs text-gray-500">
              {format(parseISO(log.created_at), 'h:mm a')}
            </div>
          </div>

          {/* Delete Button */}
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Delete entry"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Message */}
      {showConfirm && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          Are you sure you want to delete this weight entry?
        </div>
      )}
    </div>
  );
}

// Add useState import at the top
import { useState } from 'react';

export default WeightHistoryList;
