import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Button, Input } from '../ui';

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
      <label htmlFor="food-search-input" className="mb-2 block text-sm font-medium text-slate-700">
        Search food database
      </label>
      <div className="relative">
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

        <Input
          id="food-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for foods... (e.g., chicken, rice, apple)"
          className="h-12 w-full pl-12 pr-28"
          disabled={isLoading}
          aria-label="Search foods"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
              aria-label="Clear search query"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <Button
            type="submit"
            disabled={!searchQuery.trim() || isLoading}
            size="sm"
            isLoading={isLoading}
          >
            Search
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
        <Lightbulb size={14} className="text-amber-500" />
        Tip: Search by food name or brand (e.g., "grilled chicken breast")
      </p>
    </form>
  );
}

export default FoodSearchBar;
