import { memo, useMemo } from 'react';
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

function ConsistencyChart({ percentage, size = 100 }) {
  const color = useMemo(() => {
    if (percentage >= 90) return '#16a34a';
    if (percentage >= 70) return '#2563eb';
    if (percentage >= 50) return '#ca8a04';
    return '#dc2626';
  }, [percentage]);

  const data = useMemo(() => [{ name: 'Consistency', value: percentage, fill: color }], [percentage, color]);

  return (
    <div className="mx-auto" style={{ width: size, height: size }} aria-label={`${percentage.toFixed(0)}% consistency`} role="img">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="72%"
          outerRadius="100%"
          barSize={8}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={6} background />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="-mt-14 text-center">
        <p className="text-lg font-bold" style={{ color }}>{Math.round(percentage)}%</p>
      </div>
    </div>
  );
}

export default memo(ConsistencyChart);
