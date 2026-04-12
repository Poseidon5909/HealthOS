import WaterLogItem from './WaterLogItem';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { BarChart3, Droplets } from 'lucide-react';

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
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><BarChart3 size={18} /> Hydration History</h3>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><BarChart3 size={18} /> Hydration History</h3>
        <div className="text-center py-8">
          <div className="mb-4 flex justify-center"><Droplets size={48} className="text-cyan-600" /></div>
          <p className="text-gray-600 mb-2">No water logs yet</p>
          <p className="text-sm text-gray-500">Start logging your water intake above</p>
        </div>
      </div>
    );
  }

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

  const sortedGroups = Object.values(groupedLogs).sort(
    (a, b) => b.date - a.date
  );

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><BarChart3 size={18} /> Hydration History</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          {history.length} log{history.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-6">
        {sortedGroups.map(({ date, logs, totalMl }) => (
          <div key={format(date, 'yyyy-MM-dd')}>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">
                {getDateLabel(date)}
              </h4>
              <div className="text-sm text-gray-600">
                Total: <span className="font-bold text-blue-600">{totalMl} ml</span>
                {' '}({(totalMl / 250).toFixed(1)} glasses)
              </div>
            </div>

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
