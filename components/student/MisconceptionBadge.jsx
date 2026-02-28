'use client';

import { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { getSeverityColor } from '@/lib/utils';
import clsx from 'clsx';

function MisconceptionItem({ misconception }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#1A1A2E] rounded-lg border border-[#2A2A4A] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#252545] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={clsx(
            'px-3 py-1 rounded-full text-xs font-bold border',
            getSeverityColor(misconception.severity)
          )}>
            {misconception.display_name}
          </span>
          <span className={clsx(
            'px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider',
            misconception.severity === 'high' ? 'text-red-400' :
            misconception.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'
          )}>
            {misconception.severity}
          </span>
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#2A2A4A]">
          <div className="pt-3">
            <h4 className="text-xs font-semibold text-[#6C63FF] uppercase tracking-wider mb-1">
              What It Means
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">{misconception.description}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              How to Fix It
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">{misconception.remediation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MisconceptionBadge({ misconceptions, learning_profile }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!misconceptions || misconceptions.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Learning Profile */}
      {learning_profile && (
        <div className="p-4 bg-[#6C63FF]/10 border border-[#6C63FF]/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={18} className="text-[#6C63FF]" />
            <h3 className="text-sm font-semibold text-[#6C63FF]">Your Learning Profile</h3>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-gray-500 hover:text-gray-400"
              >
                <Info size={14} />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-[#252545] border border-[#2A2A4A] rounded-lg text-xs text-gray-400 shadow-xl z-10">
                  Misconception tagging identifies the underlying thinking patterns
                  that lead to errors — not just the errors themselves.
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-300 italic leading-relaxed">{learning_profile}</p>
        </div>
      )}

      {/* Misconception Items */}
      <div className="space-y-3">
        {misconceptions.map((m) => (
          <MisconceptionItem key={m.tag} misconception={m} />
        ))}
      </div>
    </div>
  );
}
