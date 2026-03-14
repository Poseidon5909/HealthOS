import { memo, useMemo } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Card } from '../ui';

function ConsistencyChart({ consistency }) {
  const metrics = useMemo(() => {
    if (!consistency) {
      return [];
    }

    return [
      { name: 'Food', value: consistency.food_logging?.consistency_percentage || 0 },
      { name: 'Workout', value: consistency.workout_logging?.consistency_percentage || 0 },
      { name: 'Hydration', value: consistency.hydration_logging?.consistency_percentage || 0 },
      { name: 'Weight', value: consistency.weight_logging?.consistency_percentage || 0 }
    ];
  }, [consistency]);

  const overall = useMemo(() => {
    if (metrics.length === 0) {
      return 0;
    }

    return metrics.reduce((sum, item) => sum + item.value, 0) / metrics.length;
  }, [metrics]);

  if (!consistency) {
    return (
      <Card hoverable>
        <h3 className="mb-3 text-lg font-semibold text-gray-800">Consistency</h3>
        <p className="text-sm text-gray-500">No consistency data available.</p>
      </Card>
    );
  }

  return (
    <Card hoverable>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Consistency Radar</h3>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
          {overall.toFixed(0)}% overall
        </span>
      </div>

      <div className="h-56 w-full" role="img" aria-label="Consistency radar chart across food, workout, hydration, and weight logging">
        <ResponsiveContainer>
          <RadarChart data={metrics}>
            <PolarGrid stroke="#cbd5e1" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} />
            <Radar name="Consistency" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(0)}%`, 'Consistency']} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default memo(ConsistencyChart);
