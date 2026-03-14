import FoodItemCard from './FoodItemCard';
import { ErrorState, Skeleton } from '../ui';

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
function FoodSearchResults({ foods = [], isLoading, isError, error, onSelectFood }) {
  // Loading State
  if (isLoading) {
    return (
      <div className="py-4">
        <div className="mb-4 text-sm font-medium text-slate-600">Searching for foods...</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
              <Skeleton className="mb-3 h-5 w-1/2" />
              <Skeleton className="mb-2 h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return <ErrorState title="Error loading foods" error={error} />;
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
