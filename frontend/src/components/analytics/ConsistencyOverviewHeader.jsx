import { memo } from 'react';

function ConsistencyOverviewHeader({ days, overallConsistency }) {
  return (
    <header className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
      <h2 className="text-2xl font-bold">Consistency Analytics</h2>
      <p className="mb-4 mt-1 text-blue-100">Tracking confidence over the last {days} days</p>

      <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
        <p className="text-sm text-blue-100">Overall Consistency</p>
        <div className="mt-2 flex items-center gap-4">
          <div className="text-4xl font-bold">{overallConsistency.toFixed(1)}%</div>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/20" aria-label="Overall consistency progress bar">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${overallConsistency}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(ConsistencyOverviewHeader);
