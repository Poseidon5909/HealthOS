import { memo } from 'react';
import { Card } from '../ui';

function ConsistencyOverviewInsights() {
  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">💡</span>
        <div>
          <h3 className="mb-2 font-semibold text-yellow-900">Why Data Visualization Helps</h3>
          <p className="text-sm leading-relaxed text-yellow-800">
            Visual analytics make trends obvious at a glance, helping users spot weak habits quickly and stay motivated by visible progress.
            Compared with raw numbers, charts reduce mental load and improve decision speed.
          </p>
        </div>
      </div>
    </Card>
  );
}

export default memo(ConsistencyOverviewInsights);
