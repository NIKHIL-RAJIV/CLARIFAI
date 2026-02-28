'use client';

import { useState } from 'react';
import { Shield, Check, ChevronDown, ChevronUp, Eye, Download, SlidersHorizontal } from 'lucide-react';
import { getScoreColor, getSeverityColor } from '@/lib/utils';
import clsx from 'clsx';

function CriterionOverride({ criterion, aiScore, evidence, override, onOverride, onAgree }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const isOverridden = override !== undefined && override !== null;
  const isAgreed = override === aiScore;

  return (
    <div className="bg-[#1A1A2E] rounded-lg border border-[#2A2A4A] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-200">{criterion}</span>
        <div className="flex items-center gap-3">
          {/* AI Score */}
          <div className="text-center">
            <span className="text-[10px] text-gray-500 uppercase block">AI</span>
            <span className={clsx('text-sm font-bold', getScoreColor(aiScore))}>
              {aiScore}/10
            </span>
          </div>

          {/* Instructor Score (if overridden) */}
          {isOverridden && !isAgreed && (
            <div className="text-center">
              <span className="text-[10px] text-cyan-400 uppercase block">You</span>
              <span className={clsx('text-sm font-bold', getScoreColor(override))}>
                {override}/10
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Agree Button */}
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

        {/* Score Slider */}
        <div className="flex-1 flex items-center gap-2">
          <SlidersHorizontal size={12} className="text-gray-500" />
          <input
            type="range"
            min="1"
            max="10"
            value={isOverridden ? override : aiScore}
            onChange={(e) => onOverride(criterion, parseInt(e.target.value))}
            className="flex-1 h-1 bg-[#2A2A4A] rounded-lg appearance-none cursor-pointer accent-[#6C63FF]"
          />
          <span className="text-xs text-gray-400 w-6 text-right">
            {isOverridden ? override : aiScore}
          </span>
        </div>
      </div>

      {/* Evidence Toggle */}
      {evidence && (
        <div>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="flex items-center gap-1 text-xs text-[#6C63FF] hover:text-[#8B83FF] transition-colors"
          >
            <Eye size={12} />
            AI Reasoning
            {showEvidence ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showEvidence && (
            <div className="mt-2 p-3 bg-[#0D0D1A] rounded border border-[#2A2A4A]">
              <p className="text-xs text-gray-500 mb-1">{evidence.evidence_location}</p>
              <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap mb-2">
                {evidence.evidence_snippet}
              </pre>
              <p className="text-xs text-gray-400">{evidence.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InstructorPanel({ evaluation, onOverride, overrides = {} }) {
  if (!evaluation) return null;

  const { scores = [], evidence = [], misconceptions = [] } = evaluation;

  const getEvidence = (criterion) => {
    return evidence.find(e => e.criterion === criterion);
  };

  const handleAgree = (criterion, score) => {
    onOverride(criterion, score);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-[#6C63FF]" />
          <h2 className="text-lg font-bold text-gray-200">Instructor View</h2>
          <span className="px-2 py-0.5 bg-[#6C63FF]/20 border border-[#6C63FF]/30 rounded text-[10px] font-bold text-[#6C63FF] uppercase">
            Audit Mode
          </span>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-[#1A1A2E] border border-[#2A2A4A] rounded text-xs text-gray-400 hover:text-gray-200 transition-colors">
          <Download size={12} />
          Export Grades
        </button>
      </div>

      {/* Criterion Overrides */}
      <div className="space-y-3">
        {scores.map((s) => (
          <CriterionOverride
            key={s.criterion}
            criterion={s.criterion}
            aiScore={s.score}
            evidence={getEvidence(s.criterion)}
            override={overrides[s.criterion]}
            onOverride={onOverride}
            onAgree={handleAgree}
          />
        ))}
      </div>

      {/* Misconception Tags */}
      {misconceptions && misconceptions.length > 0 && (
        <div className="pt-4 border-t border-[#2A2A4A]">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Detected Misconceptions
          </h3>
          <div className="flex flex-wrap gap-2">
            {misconceptions.map((m) => (
              <span
                key={m.tag}
                className={clsx(
                  'px-3 py-1 rounded-full text-xs font-medium border',
                  getSeverityColor(m.severity)
                )}
                title={m.description}
              >
                {m.display_name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
