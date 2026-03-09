import { useState } from 'react';

/**
 * FoodLogForm Component
 * 
 * Modal form for logging a food entry
 * 
 * Props:
 * - food: Selected food object
 * - onSubmit: Function called with form data
 * - onCancel: Function to close the form
 * - isSubmitting: Boolean for loading state
 */
function FoodLogForm({ food, onSubmit, onCancel, isSubmitting = false }) {
  const [quantity, setQuantity] = useState('100');
  const [mealType, setMealType] = useState('breakfast');

  if (!food) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    onSubmit({
      food_id: food.id,
      quantity_grams: quantityNum,
      meal_type: mealType
    });
  };

  // Calculate nutrition based on quantity
  const calculateNutrition = (per100g, grams) => {
    return Math.round((per100g * grams) / 100);
  };

  const quantityNum = parseFloat(quantity) || 0;
  const calculatedCalories = calculateNutrition(food.calories_per_100g, quantityNum);
  const calculatedProtein = calculateNutrition(food.protein_per_100g, quantityNum);
  const calculatedCarbs = calculateNutrition(food.carbs_per_100g, quantityNum);
  const calculatedFat = calculateNutrition(food.fat_per_100g, quantityNum);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Add to Diary</h3>
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-indigo-100 mt-1">{food.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Quantity Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (grams)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              step="1"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Standard serving: 100g
            </p>
          </div>

          {/* Meal Type Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="breakfast">🍳 Breakfast</option>
              <option value="lunch">🍱 Lunch</option>
              <option value="dinner">🍽️ Dinner</option>
              <option value="snack">🍿 Snack</option>
            </select>
          </div>

          {/* Calculated Nutrition Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Nutrition for {quantityNum}g
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded p-2">
                <div className="text-xs text-gray-600">Calories</div>
                <div className="text-lg font-bold text-gray-900">{calculatedCalories}</div>
              </div>
              <div className="bg-blue-50 rounded p-2">
                <div className="text-xs text-blue-600">Protein</div>
                <div className="text-lg font-bold text-blue-900">{calculatedProtein}g</div>
              </div>
              <div className="bg-yellow-50 rounded p-2">
                <div className="text-xs text-yellow-600">Carbs</div>
                <div className="text-lg font-bold text-yellow-900">{calculatedCarbs}g</div>
              </div>
              <div className="bg-green-50 rounded p-2">
                <div className="text-xs text-green-600">Fat</div>
                <div className="text-lg font-bold text-green-900">{calculatedFat}g</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Adding...
                </span>
              ) : (
                'Add to Diary'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FoodLogForm;
