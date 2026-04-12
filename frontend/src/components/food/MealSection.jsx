import MealSummaryCard from './MealSummaryCard';
import { Coffee, Moon, Sandwich, Utensils } from 'lucide-react';

/**
 * MealSection Component
 * 
 * Displays a meal section with food logs and summary
 * 
 * Props:
 * - mealType: 'breakfast', 'lunch', 'dinner', or 'snack'
 * - foodLogs: Array of food log entries for this meal
 * - summary: Nutrition summary object from backend
 * - onDelete: Function to delete a food log
 * - onEdit: Function to edit a food log
 * - onAddFood: Function to add food to this meal
 */
function MealSection({ mealType, foodLogs = [], summary, onDelete, onEdit, onAddFood }) {
  const mealConfig = {
    breakfast: { icon: <Coffee size={26} className="text-orange-600" />, label: 'Breakfast', color: 'orange' },
    lunch: { icon: <Sandwich size={26} className="text-blue-600" />, label: 'Lunch', color: 'blue' },
    dinner: { icon: <Utensils size={26} className="text-purple-600" />, label: 'Dinner', color: 'purple' },
    snack: { icon: <Moon size={26} className="text-green-600" />, label: 'Snacks', color: 'green' }
  };

  const config = mealConfig[mealType] || mealConfig.breakfast;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className={`bg-${config.color}-50 border-b border-${config.color}-100 p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{config.label}</h3>
              <p className="text-sm text-gray-600">
                {foodLogs.length} {foodLogs.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onAddFood(mealType)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            + Add Food
          </button>
        </div>
      </div>

      <div className="p-4">
        <MealSummaryCard mealType={mealType} summary={summary} />
        {foodLogs.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">No foods logged for {config.label.toLowerCase()} yet</p>
            <p className="text-xs mt-1">Click "Add Food" to start tracking</p>
          </div>
        ) : (
          <div className="space-y-3">
            {foodLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{log.food_name}</h4>
                  <p className="text-sm text-gray-600">{log.quantity_grams}g</p>
                </div>

                <div className="flex items-center space-x-4 mr-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Cal</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {Math.round(log.calories || 0)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-blue-500">P</div>
                    <div className="text-sm font-semibold text-blue-900">
                      {Math.round(log.protein || 0)}g
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-yellow-500">C</div>
                    <div className="text-sm font-semibold text-yellow-900">
                      {Math.round(log.carbs || 0)}g
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-green-500">F</div>
                    <div className="text-sm font-semibold text-green-900">
                      {Math.round(log.fat || 0)}g
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(log)}
                    className="text-purple-500 hover:text-purple-700 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => onDelete(log.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MealSection;
