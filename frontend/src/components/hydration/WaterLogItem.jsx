import { useState } from 'react';
import { format, parseISO } from 'date-fns';

/**
 * WaterLogItem Component
 * 
 * Displays a single water log entry with:
 * - Amount in ml and glasses
 * - Date and time
 * - Delete button with confirmation
 * 
 * Props:
 * - log: { id, amount_ml, created_at }
 * - onDelete: function(logId) - callback when delete is confirmed
 * - isDeleting: boolean - shows loading state during deletion
 */

function WaterLogItem({ log, onDelete, isDeleting = false }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Parse and format the timestamp
  const logDate = parseISO(log.created_at);
  const formattedTime = format(logDate, 'h:mm a');
  const formattedDate = format(logDate, 'MMM d, yyyy');
  
  // Check if log is from today
  const today = new Date();
  const isToday = format(logDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  
  // Calculate glasses (250ml per glass)
  const glasses = (log.amount_ml / 250).toFixed(1);

  // Get icon based on amount
  const getIcon = () => {
    if (log.amount_ml >= 1000) return '🍶';
    if (log.amount_ml >= 500) return '💧';
    return '🥤';
  };

  // Handle delete confirmation
  const handleDelete = () => {
    onDelete(log.id);
    setShowConfirmDelete(false);
  };

  return (
    <div className={`
      bg-white border rounded-lg p-4 transition-all duration-200
      ${isDeleting ? 'opacity-50 animate-pulse' : 'hover:shadow-md hover:border-blue-300'}
    `}>
      <div className="flex items-center justify-between">
        {/* Left side - Icon and Amount */}
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getIcon()}</div>
          <div>
            <div className="font-bold text-gray-900 text-lg">
              {log.amount_ml} ml
            </div>
            <div className="text-sm text-gray-600">
              {glasses} glass{parseFloat(glasses) !== 1 ? 'es' : ''}
            </div>
          </div>
        </div>

        {/* Right side - Time and Delete */}
        <div className="flex items-center space-x-3">
          {/* Time Display */}
          <div className="text-right">
            <div className="font-semibold text-gray-900 text-sm">
              {formattedTime}
            </div>
            <div className="text-xs text-gray-500">
              {isToday ? 'Today' : formattedDate}
            </div>
          </div>

          {/* Delete Button */}
          {!showConfirmDelete ? (
            <button
              onClick={() => setShowConfirmDelete(true)}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Delete water log"
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
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 disabled:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Message */}
      {showConfirmDelete && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          Are you sure you want to delete this water log?
        </div>
      )}
    </div>
  );
}

export default WaterLogItem;
