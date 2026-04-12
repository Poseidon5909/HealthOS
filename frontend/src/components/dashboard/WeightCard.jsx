import { memo } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Scale } from 'lucide-react';
import { Card } from '../ui';

/**
 * WeightCard Component
 * 
 * Displays weight tracking information:
 * - Latest weight
 * - Weekly change (with trend indicator)
 * 
 * Props:
 * - weight: { latest_weight, weekly_change }
 */

function WeightCard({ weight }) {
  if (!weight || weight.latest_weight === null) {
    return (
      <Card hoverable>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weight</h3>
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No weight data available</p>
          <p className="text-xs text-gray-400 mt-2">Start tracking your weight!</p>
        </div>
      </Card>
    );
  }

  const { 
    latest_weight = 0, 
    weekly_change = 0 
  } = weight;

  const isGain = weekly_change > 0;
  const isLoss = weekly_change < 0;
  const isStable = weekly_change === 0;

  let trendColor = 'text-gray-600';
  let trendIcon = <ArrowRight size={18} className="text-gray-600" />;
  let trendText = 'No change';
  let bgColor = 'bg-gray-50';

  if (isLoss) {
    trendColor = 'text-green-600';
    trendIcon = <ArrowDownRight size={18} className="text-green-600" />;
    trendText = 'Weight loss';
    bgColor = 'bg-green-50';
  } else if (isGain) {
    trendColor = 'text-red-600';
    trendIcon = <ArrowUpRight size={18} className="text-red-600" />;
    trendText = 'Weight gain';
    bgColor = 'bg-red-50';
  }

  return (
    <Card hoverable>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Weight</h3>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
          <Scale size={12} /> Metric
        </span>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-5xl font-bold text-gray-900">
          {latest_weight}
        </div>
        <div className="text-sm text-gray-600 mt-1">kg</div>
      </div>
      
      <div className={`${bgColor} rounded-lg p-3 mt-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{trendIcon}</span>
            <div>
              <p className="text-xs text-gray-600">Weekly Change</p>
              <p className={`text-sm font-medium ${trendColor}`}>
                {trendText}
              </p>
            </div>
          </div>
          <div className={`text-xl font-bold ${trendColor}`}>
            {weekly_change > 0 ? '+' : ''}{weekly_change} kg
          </div>
        </div>
      </div>
      
      {isLoss && (
        <div className="mt-3 text-center text-xs text-green-600 font-medium">
          Keep up the great work!
        </div>
      )}
      {isStable && (
        <div className="mt-3 text-center text-xs text-gray-600">
          Maintaining steady progress
        </div>
      )}
    </Card>
  );
}

export default memo(WeightCard);
