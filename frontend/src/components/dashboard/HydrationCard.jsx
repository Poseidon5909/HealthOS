import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui';
import { ICON_EMOJIS } from '../../constants/icons';

/**
 * HydrationCard Component
 * 
 * Displays daily water intake progress with:
 * - Water consumed (ml)
 * - Target (ml)
 * - Progress percentage
 * - Visual circular progress indicator
 * 
 * Props:
 * - hydration: { consumed_ml, target_ml, progress_percentage }
 */

function HydrationCard({ hydration }) {
  if (!hydration) {
    return (
      <Card hoverable>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Hydration</h3>
        <p className="text-gray-500 text-sm">No hydration data available</p>
      </Card>
    );
  }

  const { 
    consumed_ml = 0, 
    target_ml = 0, 
    progress_percentage = 0 
  } = hydration;

  const glassesConsumed = Math.floor(consumed_ml / 250);
  const glassesTarget = Math.floor(target_ml / 250);

  const progressColor = progress_percentage >= 100 
    ? 'bg-green-500' 
    : progress_percentage >= 50 
    ? 'bg-blue-500' 
    : 'bg-blue-300';

  return (
    <Card hoverable>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Hydration</h3>
        <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">{ICON_EMOJIS.water} Water</span>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">
            {glassesConsumed}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            of {glassesTarget} glasses
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-3" role="progressbar" aria-label="Hydration progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress_percentage)}>
          <motion.div
            className={`${progressColor} h-3 rounded-full transition-all duration-500`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress_percentage, 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ width: `${Math.min(progress_percentage, 100)}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Consumed</span>
          <span className="font-semibold text-gray-900">{consumed_ml} ml</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Target</span>
          <span className="font-semibold text-gray-900">{target_ml} ml</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Progress</span>
          <span className="font-semibold text-blue-600">{progress_percentage.toFixed(0)}%</span>
        </div>
      </div>
      
      {progress_percentage >= 100 && (
        <div className="mt-4 text-center text-sm text-green-600 font-medium">
          {ICON_EMOJIS.celebration} Daily goal achieved!
        </div>
      )}
    </Card>
  );
}

export default memo(HydrationCard);
