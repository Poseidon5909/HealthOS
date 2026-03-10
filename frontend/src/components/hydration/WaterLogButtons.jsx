import { useState } from 'react';

/**
 * WaterLogButtons Component
 * 
 * Provides quick-add buttons for common water intake amounts.
 * Also includes a custom input for specific amounts.
 * 
 * Props:
 * - onLogWater: function(amount_ml) - callback when water is logged
 * - isLogging: boolean - shows loading state during API call
 * 
 * Features:
 * - Quick-add buttons for 250ml, 500ml, 750ml, 1000ml
 * - Custom amount input
 * - Visual feedback during logging
 * - Disabled state during API calls
 */

function WaterLogButtons({ onLogWater, isLogging = false }) {
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Predefined water amounts (in ml)
  const quickAmounts = [
    { ml: 250, label: '250ml', icon: '🥤', description: '1 glass' },
    { ml: 500, label: '500ml', icon: '💧', description: '2 glasses' },
    { ml: 750, label: '750ml', icon: '🚰', description: '3 glasses' },
    { ml: 1000, label: '1L', icon: '🍶', description: 'Bottle' }
  ];

  // Handle quick add button click
  const handleQuickAdd = async (amount) => {
    await onLogWater(amount);
  };

  // Handle custom amount submission
  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    const amount = parseInt(customAmount);
    
    // Validate input
    if (!amount || amount <= 0 || amount > 5000) {
      alert('Please enter a valid amount between 1 and 5000 ml');
      return;
    }

    await onLogWater(amount);
    setCustomAmount('');
    setShowCustomInput(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        ⚡ Quick Add Water
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Click a button to quickly log your water intake
      </p>

      {/* Quick Add Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {quickAmounts.map(({ ml, label, icon, description }) => (
          <button
            key={ml}
            onClick={() => handleQuickAdd(ml)}
            disabled={isLogging}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${isLogging 
                ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50' 
                : 'bg-blue-50 border-blue-300 hover:bg-blue-100 hover:border-blue-500 hover:shadow-md active:scale-95'
              }
            `}
          >
            <div className="text-3xl mb-2">{icon}</div>
            <div className="font-bold text-gray-900 text-lg">{label}</div>
            <div className="text-xs text-gray-600 mt-1">{description}</div>
          </button>
        ))}
      </div>

      {/* Custom Amount Section */}
      {!showCustomInput ? (
        <button
          onClick={() => setShowCustomInput(true)}
          disabled={isLogging}
          className="w-full py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add Custom Amount
        </button>
      ) : (
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div>
            <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Amount (ml)
            </label>
            <input
              id="customAmount"
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter amount in ml"
              min="1"
              max="5000"
              disabled={isLogging}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter between 1 and 5000 ml
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLogging || !customAmount}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLogging ? 'Logging...' : 'Add Water'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(false);
                setCustomAmount('');
              }}
              disabled={isLogging}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Loading Indicator */}
      {isLogging && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800 font-medium">Logging water intake...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default WaterLogButtons;
