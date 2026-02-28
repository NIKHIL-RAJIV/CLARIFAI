'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MapPin, MessageSquare } from 'lucide-react';
import { getSentimentColor } from '@/lib/utils';
import clsx from 'clsx';

function EvidenceItem({ evidence }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#1A1A2E] rounded-lg border border-[#2A2A4A] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#252545] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-200">{evidence.criterion}</span>
          <span className={clsx(
            'text-xs font-medium',
            evidence.score >= 7 ? 'text-green-400' : evidence.score >= 4 ? 'text-amber-400' : 'text-red-400'
          )}>
            {evidence.score}/10
          </span>
          <span className={clsx(
            'text-[10px] uppercase tracking-wider font-medium',
            getSentimentColor(evidence.sentiment)
          )}>
            {evidence.sentiment}
          </span>
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#2A2A4A]">
          <div className="pt-3 flex items-start gap-2">
            <MapPin size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs text-cyan-400 font-medium">{evidence.evidence_location}</span>
              <pre className="mt-1 p-2 bg-[#0D0D1A] rounded text-xs text-gray-400 font-mono whitespace-pre-wrap">
                {evidence.evidence_snippet}
              </pre>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MessageSquare size={14} className="text-[#6C63FF] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-400 leading-relaxed">{evidence.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EvidenceHighlighter({ evidence }) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Search size={16} className="text-[#6C63FF]" />
        <h3 className="text-sm font-semibold text-gray-300">Evidence per Criterion</h3>
      </div>
      {evidence.map((e, i) => (
        <EvidenceItem key={`${e.criterion}-${i}`} evidence={e} />
      ))}
    </div>
  );
}
