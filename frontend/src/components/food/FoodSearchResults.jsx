import FoodItemCard from './FoodItemCard';

/**
 * FoodSearchResults Component
 * 
 * Displays a grid of food search results
 * 
 * Props:
 * - foods: Array of food items
 * - isLoading: Boolean for loading state
 * - isError: Boolean for error state
 * - onSelectFood: Function called when user selects a food
 */
function FoodSearchResults({ foods = [], isLoading, isError, onSelectFood }) {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Searching for foods...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Foods
        </h3>
        <p className="text-red-600">
          Unable to search foods. Please try again.
        </p>
      </div>
    );
  }

  // No Results State
  if (!foods || foods.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Foods Found
        </h3>
        <p className="text-gray-600">
          Try searching with a different term
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Examples: "chicken breast", "brown rice", "apple"
        </p>
      </div>
    );
  }

  // Results Grid
  return (
    <div>
      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Found <span className="font-semibold text-gray-900">{foods.length}</span> foods
        </p>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {foods.map((food) => (
          <FoodItemCard
            key={food.id}
            food={food}
            onSelect={onSelectFood}
          />
        ))}
      </div>
    </div>
  );
}

export default FoodSearchResults;
