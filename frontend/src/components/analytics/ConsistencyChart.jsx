import React from 'react';

/**
 * ConsistencyChart Component (Day 11)
 * 
 * Circular progress indicator for consistency visualization.
 * 
 * Props:
 * @param {number} percentage - Consistency percentage (0-100)
 * @param {number} size - Diameter of the circle in pixels (default: 100)
 * 
 * Why SVG for charts:
 * 1. Scalable - looks crisp at any size
 * 2. Lightweight - minimal file size
 * 3. Animatable - smooth CSS transitions
 * 4. Accessible - can add ARIA labels
 * 5. Customizable - Easy to style with CSS
 * 
 * Why circular progress is effective:
 * 1. Shows completion at a glance
 * 2. Space-efficient compared to bars
 * 3. Visually engaging and modern
 * 4. Universal understanding (like clock faces)
 * 5. Creates sense of achievement when high
 * 
 * Technical approach:
 * - SVG circle with stroke-dasharray for progress
 * - Percentage text centered inside
 * - Color-coded based on performance
 * - Smooth animations for visual appeal
 */

function ConsistencyChart({ percentage, size = 100 }) {
  
  // Circle dimensions
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  /**
   * Calculate stroke offset for progress
   * 
   * stroke-dasharray: Total circumference (full circle)
   * stroke-dashoffset: Portion to hide (100% - current percentage)
   * 
   * Example: 75% progress
   * - circumference = 282
   * - offset = 282 * (1 - 0.75) = 70.5
   * - Shows 75% of circle, hides 25%
   */
  const offset = circumference * (1 - percentage / 100);

  /**
   * Color-code based on performance
   * Visual feedback motivates user behavior
   */
  const getColor = () => {
    if (percentage >= 90) return '#16a34a'; // green-600
    if (percentage >= 70) return '#2563eb'; // blue-600
    if (percentage >= 50) return '#ca8a04'; // yellow-600
    return '#dc2626'; // red-600
  };

  return (
    <div className="flex justify-center items-center">
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90"
        aria-label={`${percentage}% consistency`}
        role="img"
      >
        {/* Background circle (gray) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle (colored) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
        
        {/* Percentage text in center */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="transform rotate-90"
          style={{ 
            fontSize: size / 4, 
            fontWeight: 'bold',
            fill: getColor(),
            transformOrigin: 'center'
          }}
        >
          {Math.round(percentage)}%
        </text>
      </svg>
    </div>
  );
}

export default ConsistencyChart;
