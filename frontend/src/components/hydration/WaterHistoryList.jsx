import WaterLogItem from './WaterLogItem';
import { format, parseISO, isToday, isYesterday } from 'date-fns';

/**
 * WaterHistoryList Component
 * 
 * Displays a list of water log entries grouped by date.
 * 
 * Props:
 * - history: Array of water log objects
 * - onDeleteLog: function(logId) - callback when a log should be deleted
 * - deletingLogId: number - ID of the log currently being deleted
 * - isLoading: boolean - shows loading state
 * 
 * Features:
 * - Groups logs by date (Today, Yesterday, specific dates)
 * - Shows total water consumed per day
 * - Empty state when no history
 * - Loading skeleton
 */

function WaterHistoryList({ history = [], onDeleteLog, deletingLogId = null, isLoading = false }) {
  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Hydration History</h3>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Hydration History</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">💧</div>
          <p className="text-gray-600 mb-2">No water logs yet</p>
          <p className="text-sm text-gray-500">Start logging your water intake above</p>
        </div>
      </div>
    );
  }

  // Group logs by date
  const groupedLogs = history.reduce((groups, log) => {
    const logDate = parseISO(log.created_at);
    const dateKey = format(logDate, 'yyyy-MM-dd');
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: logDate,
        logs: [],
        totalMl: 0
      };
    }
    
    groups[dateKey].logs.push(log);
    groups[dateKey].totalMl += log.amount_ml;
    
    return groups;
  }, {});

  // Convert to array and sort by date (newest first)
  const sortedGroups = Object.values(groupedLogs).sort(
    (a, b) => b.date - a.date
  );

  // Get date label (Today, Yesterday, or formatted date)
  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">📊 Hydration History</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          {history.length} log{history.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grouped Logs */}
      <div className="space-y-6">
        {sortedGroups.map(({ date, logs, totalMl }) => (
          <div key={format(date, 'yyyy-MM-dd')}>
            {/* Date Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">
                {getDateLabel(date)}
              </h4>
              <div className="text-sm text-gray-600">
                Total: <span className="font-bold text-blue-600">{totalMl} ml</span>
                {' '}({(totalMl / 250).toFixed(1)} glasses)
              </div>
            </div>

            {/* Logs for this date */}
            <div className="space-y-2">
              {logs.map((log) => (
                <WaterLogItem
                  key={log.id}
                  log={log}
                  onDelete={onDeleteLog}
                  isDeleting={deletingLogId === log.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      {history.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total entries:</span>
            <span className="font-bold text-gray-900">{history.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Days tracked:</span>
            <span className="font-bold text-gray-900">{sortedGroups.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default WaterHistoryList;
