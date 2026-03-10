import { useState } from 'react';

/**
 * WeightLogForm Component
 * 
 * Form for logging weight entries with validation.
 * 
 * Props:
 * - onSubmit: function(weightData) - callback when form is submitted
 * - isLogging: boolean - shows loading state during API call
 * 
 * Features:
 * - Weight input with validation (20-500 kg)
 * - Optional date picker (defaults to today)
 * - Input validation and error messages
 * - Disabled state during submission
 * - Auto-clear after successful submission
 */

function WeightLogForm({ onSubmit, isLogging = false }) {
  console.log('📝 WeightLogForm props:', { onSubmit: !!onSubmit, isLogging });
  
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  // Validate weight input
  const validateWeight = (value) => {
    const numValue = parseFloat(value);
    
    if (!value || isNaN(numValue)) {
      return 'Please enter a valid weight';
    }
    if (numValue < 20) {
      return 'Weight must be at least 20 kg';
    }
    if (numValue > 500) {
      return 'Weight cannot exceed 500 kg';
    }
    return '';
  };

  // Handle weight input change
  const handleWeightChange = (e) => {
    const value = e.target.value;
    setWeight(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate before submitting
    const validationError = validateWeight(weight);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Prepare data
    const weightData = {
      weight: parseFloat(weight),
      date: date
    };

    try {
      await onSubmit(weightData);
      
      // Clear form on success
      setWeight('');
      setDate(new Date().toISOString().split('T')[0]);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to log weight');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📝 Log Weight
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Track your weight progress by logging regular entries
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Weight Input */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg) *
          </label>
          <input
            id="weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={handleWeightChange}
            placeholder="Enter your weight"
            disabled={isLogging}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              error 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            min="20"
            max="500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter weight between 20 and 500 kg
          </p>
        </div>

        {/* Date Input */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            disabled={isLogging}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Date cannot be in the future
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLogging || !weight}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {isLogging ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Logging...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Log Weight
            </>
          )}
        </button>
      </form>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 font-medium mb-2">💡 Best Practices:</p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Weigh yourself at the same time each day (preferably morning)</li>
          <li>• Use the same scale for consistency</li>
          <li>• Track weekly trends, not daily fluctuations</li>
        </ul>
      </div>
    </div>
  );
}

export default WeightLogForm;
