import { memo, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card, Loader } from '../ui';

function WeightChart({ data = [], isLoading = false }) {
  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        date: item.date,
        weight: Number(item.weight || 0),
        label: format(parseISO(item.date), 'MMM d')
      }));
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <Loader label="Loading weight trend..." />
      </Card>
    );
  }

  if (chartData.length < 2) {
    return (
      <Card hoverable>
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Weight Trend</h3>
        <div className="py-10 text-center">
          <p className="text-sm text-gray-600">Log at least two weight entries to visualize your trend.</p>
        </div>
      </Card>
    );
  }

  const minValue = Math.min(...chartData.map((item) => item.weight));
  const maxValue = Math.max(...chartData.map((item) => item.weight));
  const pad = Math.max((maxValue - minValue) * 0.15, 1);

  return (
    <Card hoverable>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Weight Trend</h3>
        <p className="text-xs text-gray-500">Interactive chart</p>
      </div>

      <div className="h-72 w-full" role="img" aria-label="Weight progress chart over time">
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis
              domain={[Math.max(minValue - pad, 0), maxValue + pad]}
              tick={{ fontSize: 12, fill: '#64748b' }}
              width={45}
              tickFormatter={(value) => `${value}kg`}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', borderColor: '#cbd5e1' }}
              formatter={(value) => [`${value} kg`, 'Weight']}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.label || ''}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#weightGradient)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default memo(WeightChart);
