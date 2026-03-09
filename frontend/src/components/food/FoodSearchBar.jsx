import { useState } from 'react';

/**
 * FoodSearchBar Component
 * 
 * Search input for finding foods in the database
 * 
 * Props:
 * - onSearch: Function called when user searches
 * - isLoading: Boolean to show loading state
 */
function FoodSearchBar({ onSearch, isLoading = false }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch(''); // Clear search results
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for foods... (e.g., chicken, rice, apple)"
          className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={isLoading}
        />

        {/* Action Buttons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <button
            type="submit"
            disabled={!searchQuery.trim() || isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Searching...</span>
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

      {/* Search Tips */}
      <p className="text-sm text-gray-500 mt-2">
        💡 Tip: Search by food name or brand (e.g., "grilled chicken breast")
      </p>
    </form>
  );
}

export default FoodSearchBar;
