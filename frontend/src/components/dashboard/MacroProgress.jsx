import { memo, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../ui';

function MacroProgress({ macros }) {
  const chartData = useMemo(() => {
    const safe = macros || {};
    const rows = [
      { name: 'Protein', consumed: safe.protein?.consumed || 0, target: safe.protein?.target || 0, color: '#3b82f6' },
      { name: 'Carbs', consumed: safe.carbs?.consumed || 0, target: safe.carbs?.target || 0, color: '#f59e0b' },
      { name: 'Fat', consumed: safe.fat?.consumed || 0, target: safe.fat?.target || 0, color: '#22c55e' }
    ];

    return rows.map((row) => ({
      ...row,
      progress: row.target > 0 ? Math.min((row.consumed / row.target) * 100, 100) : 0
    }));
  }, [macros]);

  if (!macros) {
    return (
      <Card hoverable>
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Macro Tracking</h3>
        <p className="text-sm text-gray-500">No macro data available.</p>
      </Card>
    );
  }

  return (
    <Card hoverable>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Macro Tracking</h3>
        <p className="text-xs text-gray-500">Visual progress against daily targets</p>
      </div>

      <div className="h-52 w-full" role="img" aria-label="Macro intake chart for protein, carbs, and fat">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 6, right: 10, left: 0, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} width={38} domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{ borderRadius: '12px', borderColor: '#cbd5e1' }}
              formatter={(value, _name, item) => {
                const row = item?.payload;
                return [`${Number(value).toFixed(0)}% (${row?.consumed}g / ${row?.target}g)`, 'Progress'];
              }}
            />
            <Bar dataKey="progress" radius={[8, 8, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 space-y-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs text-gray-600">
            <span>{item.name}</span>
            <span className="font-medium text-gray-800">{item.consumed}g / {item.target}g</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default memo(MacroProgress);
