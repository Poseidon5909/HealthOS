import { BarChart3 } from 'lucide-react';

/**
 * MealSummaryCard Component
 * 
 * Displays nutrition summary for a specific meal type
 * Shows total calories, protein, carbs, fat, and item count
 * Updates automatically after adding/editing/deleting food logs
 */
function MealSummaryCard({ mealType, summary }) {
  const {
    total_calories = 0,
    total_protein = 0,
    total_carbs = 0,
    total_fat = 0,
    count = 0
  } = summary || {};

  if (count === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-dashed border-gray-200">
        <p className="text-gray-500 text-sm text-center">
          No foods logged for this meal yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 border border-indigo-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 inline-flex items-center gap-1">
          <BarChart3 size={14} /> Meal Summary
        </h4>
        <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-indigo-600">
            {Math.round(total_calories)}
          </span>
          <span className="text-sm text-gray-600 ml-2">calories</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-lg p-2 text-center">
          <div className="text-xs text-gray-600 mb-1">Protein</div>
          <div className="text-lg font-bold text-blue-600">
            {Math.round(total_protein)}g
          </div>
        </div>

        <div className="bg-white rounded-lg p-2 text-center">
          <div className="text-xs text-gray-600 mb-1">Carbs</div>
          <div className="text-lg font-bold text-yellow-600">
            {Math.round(total_carbs)}g
          </div>
        </div>

        <div className="bg-white rounded-lg p-2 text-center">
          <div className="text-xs text-gray-600 mb-1">Fat</div>
          <div className="text-lg font-bold text-green-600">
            {Math.round(total_fat)}g
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealSummaryCard;
