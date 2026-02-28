'use client';

import { Check, SlidersHorizontal } from 'lucide-react';
import { getScoreColor } from '@/lib/utils';
import clsx from 'clsx';

export default function OverrideControls({ criterion, aiScore, maxScore = 10, override, onOverride, onAgree }) {
  const isAgreed = override === aiScore;
  const isOverridden = override !== undefined && override !== null;

  return (
    <div className="flex items-center gap-3">
      {/* Agree */}
      <button
        onClick={() => onAgree(criterion, aiScore)}
        className={clsx(
          'flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-all',
          isAgreed
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-[#252545] text-gray-400 hover:text-green-400 hover:bg-green-500/10'
        )}
      >
        <Check size={12} />
        {isAgreed ? 'Agreed' : 'Agree'}
      </button>

      {/* Slider */}
      <div className="flex-1 flex items-center gap-2">
        <SlidersHorizontal size={12} className="text-gray-500" />
        <input
          type="range"
          min="1"
          max={maxScore}
          value={isOverridden ? override : aiScore}
          onChange={(e) => onOverride(criterion, parseInt(e.target.value))}
          className="flex-1 h-1 bg-[#2A2A4A] rounded-lg appearance-none cursor-pointer accent-[#6C63FF]"
        />
        <span className={clsx('text-xs font-semibold w-8 text-right', getScoreColor(isOverridden ? override : aiScore, maxScore))}>
          {isOverridden ? override : aiScore}
        </span>
      </div>
    </div>
  );
}
