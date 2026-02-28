'use client';

import { useState } from 'react';
import { Zap, ArrowUp, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { getDifficultyColor } from '@/lib/utils';
import clsx from 'clsx';

function CounterfactualItem({ cf, index }) {
  const [expanded, setExpanded] = useState(index === 0); // first one open by default

  const scoreColor = (score) =>
    score >= 7 ? 'text-green-400' : score >= 4 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="bg-[#1A1A2E] rounded-lg border border-[#2A2A4A] overflow-hidden transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#252545] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-200">{cf.criterion}</span>
          <span className={clsx(
            'px-2 py-0.5 rounded-full text-xs font-medium border',
            getDifficultyColor(cf.difficulty)
          )}>
            {cf.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Score change */}
          <div className="flex items-center gap-1.5 text-sm">
            <span className={scoreColor(cf.current_score)}>{cf.current_score}/10</span>
            <ArrowUp size={14} className="text-cyan-400" />
            <span className={scoreColor(cf.predicted_new_score)}>{cf.predicted_new_score}/10</span>
            <span className="text-green-400 font-semibold text-xs ml-1">
              +{cf.score_delta}
            </span>
          </div>
          {expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#2A2A4A]">
          <div className="pt-3">
            <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              Suggested Change
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">{cf.suggested_change}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#6C63FF] uppercase tracking-wider mb-1">
              Why This Helps
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">{cf.change_reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CounterfactualCard({ counterfactuals, quick_win, onReEvaluate }) {
  if (!counterfactuals || counterfactuals.length === 0) return null;

  // Sort by score_delta descending (highest impact first)
  const sorted = [...counterfactuals].sort((a, b) => b.score_delta - a.score_delta);

  return (
    <div className="space-y-4">
      {/* Quick Win Banner */}
      {quick_win && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <Zap size={20} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-400 mb-1">Quick Win</h3>
            <p className="text-sm text-amber-200/90 leading-relaxed">{quick_win}</p>
          </div>
        </div>
      )}

      {/* Counterfactual Cards */}
      <div className="space-y-3">
        {sorted.map((cf, i) => (
          <CounterfactualItem key={cf.criterion} cf={cf} index={i} />
        ))}
      </div>

      {/* Re-Evaluate Button */}
      {onReEvaluate && (
        <button
          onClick={onReEvaluate}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-600/30 transition-colors"
        >
          <RotateCcw size={16} />
          Apply & Re-evaluate
        </button>
      )}
    </div>
  );
}
