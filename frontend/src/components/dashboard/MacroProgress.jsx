/**
 * MacroProgress Component
 * 
 * Displays macronutrient breakdown with progress bars:
 * - Protein (blue)
 * - Carbs (yellow)
 * - Fat (green)
 * 
 * Props:
 * - macros: { 
 *     protein: { consumed, target },
 *     carbs: { consumed, target },
 *     fat: { consumed, target }
 *   }
 */

function MacroProgress({ macros }) {
  // Handle empty data
  if (!macros) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Macros</h3>
        <p className="text-gray-500 text-sm">No macro data available</p>
      </div>
    );
  }

  // Macro configurations for rendering
  const macroConfig = [
    {
      name: 'Protein',
      data: macros.protein || { consumed: 0, target: 0 },
      color: 'bg-blue-500',
      icon: '🥩',
      unit: 'g'
    },
    {
      name: 'Carbs',
      data: macros.carbs || { consumed: 0, target: 0 },
      color: 'bg-yellow-500',
      icon: '🍞',
      unit: 'g'
    },
    {
      name: 'Fat',
      data: macros.fat || { consumed: 0, target: 0 },
      color: 'bg-green-500',
      icon: '🥑',
      unit: 'g'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Macros</h3>
      
      {/* Macro Progress Bars */}
      <div className="space-y-4">
        {macroConfig.map(({ name, data, color, icon, unit }) => {
          const { consumed = 0, target = 0 } = data;
          const percentage = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
          
          return (
            <div key={name}>
              {/* Macro Name and Values */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {icon} {name}
                </span>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{consumed}{unit}</span>
                  {' / '}
                  {target}{unit}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${color} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              {/* Percentage */}
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MacroProgress;
