/**
 * FoodItemCard Component
 * 
 * Displays a food item with nutritional information
 * Used in search results
 * 
 * Props:
 * - food: Food object with nutrition data
 * - onSelect: Function called when user clicks to add food
 */
function FoodItemCard({ food, onSelect }) {
  const {
    id,
    name,
    calories_per_100g,
    protein_per_100g,
    carbs_per_100g,
    fat_per_100g,
    brand = null
  } = food;

  return (
    <div 
      onClick={() => onSelect(food)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Food Name and Brand */}
      <div className="mb-3">
        <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
        {brand && (
          <p className="text-sm text-gray-500">{brand}</p>
        )}
      </div>

      {/* Nutrition Info - Per 100g */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {/* Calories */}
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-600 mb-1">Calories</div>
          <div className="text-sm font-bold text-gray-900">{calories_per_100g}</div>
          <div className="text-xs text-gray-500">kcal</div>
        </div>

        {/* Protein */}
        <div className="bg-blue-50 rounded-lg p-2">
          <div className="text-xs text-blue-600 mb-1">Protein</div>
          <div className="text-sm font-bold text-blue-900">{protein_per_100g}g</div>
          <div className="text-xs text-blue-500">per 100g</div>
        </div>

        {/* Carbs */}
        <div className="bg-yellow-50 rounded-lg p-2">
          <div className="text-xs text-yellow-600 mb-1">Carbs</div>
          <div className="text-sm font-bold text-yellow-900">{carbs_per_100g}g</div>
          <div className="text-xs text-yellow-500">per 100g</div>
        </div>

        {/* Fat */}
        <div className="bg-green-50 rounded-lg p-2">
          <div className="text-xs text-green-600 mb-1">Fat</div>
          <div className="text-sm font-bold text-green-900">{fat_per_100g}g</div>
          <div className="text-xs text-green-500">per 100g</div>
        </div>
      </div>

      {/* Add Button Hint */}
      <div className="mt-3 text-center">
        <span className="text-xs text-indigo-600 font-medium">
          Click to add to diary 📝
        </span>
      </div>
    </div>
  );
}

export default FoodItemCard;
