import { format, parseISO } from 'date-fns';

/**
 * WeightChart Component
 * 
 * Displays weight trend over time using a custom SVG line chart.
 * 
 * Props:
 * - data: Array of weight log objects [{date, weight, ...}]
 * - isLoading: boolean - shows loading state
 * 
 * Features:
 * - Custom SVG-based line chart (no external dependencies)
 * - Responsive design
 * - Hover tooltips showing exact values
 * - Auto-scaling based on data range
 * - Shows trend line with data points
 * - X-axis: dates
 * - Y-axis: weight values
 * 
 * Why visual charts matter:
 * - Humans process visual information 60,000x faster than text
 * - Trends and patterns become immediately obvious
 * - Motivational - seeing progress keeps users engaged
 * - Better decision making based on visual patterns
 */

function WeightChart({ data = [], isLoading = false }) {
  console.log('📈 WeightChart props:', { dataLength: data?.length, isLoading });
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Show empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📈 Weight Trend
        </h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-600 mb-2">Not enough data for chart</p>
          <p className="text-sm text-gray-500">
            Log at least 2 weight entries to see your trend
          </p>
        </div>
      </div>
    );
  }

  // Need at least 2 data points for a trend
  if (data.length < 2) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📈 Weight Trend
        </h3>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-600 mb-2">Need more data points</p>
          <p className="text-sm text-gray-500">
            Log one more weight entry to see your trend line
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        📈 Weight Trend
      </h3>
      <WeightChartSVG data={data} />
      
      {/* Chart Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span className="text-gray-600">Weight (kg)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 bg-blue-500 rounded mr-2"></div>
          <span className="text-gray-600">Trend Line</span>
        </div>
      </div>
    </div>
  );
}

/**
 * WeightChartSVG - The actual SVG chart renderer
 */
function WeightChartSVG({ data }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Sort data by date (oldest to newest for chart)
  const sortedData = [...data].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Chart dimensions
  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Get min and max weights for scaling
  const weights = sortedData.map(d => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  
  // Add some padding to the scale (5% on each side)
  const weightRange = maxWeight - minWeight;
  const yMin = minWeight - (weightRange * 0.1 || 5);
  const yMax = maxWeight + (weightRange * 0.1 || 5);

  // Scale functions
  const xScale = (index) => {
    return padding.left + (index / (sortedData.length - 1)) * chartWidth;
  };

  const yScale = (weight) => {
    return padding.top + chartHeight - ((weight - yMin) / (yMax - yMin)) * chartHeight;
  };

  // Generate path for the line
  const linePath = sortedData
    .map((point, index) => {
      const x = xScale(index);
      const y = yScale(point.weight);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Generate area under the line
  const areaPath = `
    ${linePath}
    L ${xScale(sortedData.length - 1)} ${padding.top + chartHeight}
    L ${xScale(0)} ${padding.top + chartHeight}
    Z
  `;

  // Y-axis ticks (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const value = yMin + ((yMax - yMin) / 4) * i;
    return value;
  });

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: '400px' }}
      >
        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={yScale(tick)}
            x2={width - padding.right}
            y2={yScale(tick)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Area under line */}
        <path
          d={areaPath}
          fill="url(#gradient)"
          opacity="0.2"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {sortedData.map((point, index) => {
          const x = xScale(index);
          const y = yScale(point.weight);
          const isHovered = hoveredPoint === index;

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 8 : 5}
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              
              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 60}
                    y={y - 50}
                    width="120"
                    height="40"
                    fill="white"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    rx="6"
                  />
                  <text
                    x={x}
                    y={y - 30}
                    textAnchor="middle"
                    className="text-sm font-bold fill-gray-900"
                  >
                    {point.weight.toFixed(1)} kg
                  </text>
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {format(parseISO(point.date), 'MMM d')}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#6b7280"
          strokeWidth="2"
        />

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => (
          <text
            key={i}
            x={padding.left - 10}
            y={yScale(tick)}
            textAnchor="end"
            alignmentBaseline="middle"
            className="text-xs fill-gray-600"
          >
            {tick.toFixed(1)}
          </text>
        ))}

        {/* Y-axis label */}
        <text
          x={20}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90, 20, ${height / 2})`}
          className="text-sm fill-gray-700 font-semibold"
        >
          Weight (kg)
        </text>

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#6b7280"
          strokeWidth="2"
        />

        {/* X-axis labels */}
        {sortedData.map((point, index) => {
          // Show every nth label to avoid crowding
          const showLabel = sortedData.length <= 10 || index % Math.ceil(sortedData.length / 10) === 0;
          if (!showLabel) return null;

          const x = xScale(index);
          return (
            <text
              key={index}
              x={x}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {format(parseISO(point.date), 'MMM d')}
            </text>
          );
        })}

        {/* X-axis label */}
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          className="text-sm fill-gray-700 font-semibold"
        >
          Date
        </text>
      </svg>
    </div>
  );
}

import { useState } from 'react';

export default WeightChart;
