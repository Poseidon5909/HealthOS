import React from 'react';

/**
 * HabitToggleButton Component (Day 12)
 * 
 * Interactive button for marking habits as complete/incomplete.
 * Used for manually logging custom habits like meditation or sleep.
 * 
 * Props:
 * @param {string} habitType - Type of habit (hydration, workout, etc.)
 * @param {boolean} isComplete - Current completion status
 * @param {Function} onToggle - Handler called when button is clicked
 * @param {boolean} isLoading - Loading state during API call
 * @param {boolean} disabled - Whether button is disabled
 * 
 * UX Design Principles:
 * 1. **Immediate Feedback** - Visual change on click (optimistic update)
 * 2. **Clear States** - Different appearance for complete/incomplete
 * 3. **Loading State** - Spinner during API call
 * 4. **Disabled State** - Visual indication when action not allowed
 * 5. **Hover Effects** - Interactive feel
 * 
 * Why manual logging:
 * Some habits (meditation, sleep quality, mood) can't be
 * automatically tracked. Manual logging gives users control
 * while maintaining the streak and accountability system.
 * 
 * Interaction Pattern:
 * 1. User clicks button
 * 2. Button shows loading spinner
 * 3. API call is made
 * 4. On success: Button updates visually
 * 5. On error: Button reverts, shows error message
 */

function HabitToggleButton({ 
  habitType,
  isComplete = false,
  onToggle,
  isLoading = false,
  disabled = false 
}) {

  /**
   * Handle button click
   * Prevents multiple clicks during loading
   */
  const handleClick = () => {
    if (!disabled && !isLoading && onToggle) {
      onToggle(habitType, !isComplete);
    }
  };

  /**
   * Determine button styling based on state
   */
  const getButtonClasses = () => {
    const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]';
    
    if (disabled || isLoading) {
      return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`;
    }
    
    if (isComplete) {
      return `${baseClasses} bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg`;
    }
    
    return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg`;
  };

  /**
   * Get button text based on state
   */
  const getButtonText = () => {
    if (isLoading) return 'Saving...';
    if (isComplete) return 'Completed';
    return 'Mark Complete';
  };

  /**
   * Get button icon based on state
   */
  const getButtonIcon = () => {
    if (isLoading) {
      return (
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    
    if (isComplete) {
      return <span className="text-xl">✓</span>;
    }
    
    return <span className="text-xl">○</span>;
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={getButtonClasses()}
      aria-label={isComplete ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {getButtonIcon()}
      <span>{getButtonText()}</span>
    </button>
  );
}

export default HabitToggleButton;
