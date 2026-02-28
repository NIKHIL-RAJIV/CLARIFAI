'use client';

import { CheckCircle2, Loader2, Clock, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const LAYERS = [
  { id: 1, label: 'Rubric Evaluator', description: 'Scoring each criterion 1–10', icon: '📊' },
  { id: 2, label: 'Evidence Extractor', description: 'Citing evidence for each score', icon: '🔍' },
  { id: 3, label: 'Counterfactual Coach', description: 'Generating improvement suggestions', icon: '💡' },
  { id: 4, label: 'Misconception Tagger', description: 'Identifying cognitive patterns', icon: '🧠' },
];

function LayerStep({ layer, currentLayer }) {
  const isComplete = currentLayer > layer.id;
  const isActive = currentLayer === layer.id;
  const isWaiting = currentLayer < layer.id;

  return (
    <div className={clsx(
      'flex items-center gap-4 p-4 rounded-lg transition-all duration-500',
      isActive && 'bg-[#6C63FF]/10 border border-[#6C63FF]/30 shadow-lg shadow-[#6C63FF]/10',
      isComplete && 'bg-green-500/5 border border-green-500/20',
      isWaiting && 'bg-[#1A1A2E]/50 border border-transparent'
    )}>
      {/* Status Icon */}
      <div className={clsx(
        'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500',
        isComplete && 'bg-green-500/20',
        isActive && 'bg-[#6C63FF]/20',
        isWaiting && 'bg-[#2A2A4A]'
      )}>
        {isComplete ? (
          <CheckCircle2 size={20} className="text-green-400" />
        ) : isActive ? (
          <Loader2 size={20} className="text-[#6C63FF] animate-spin" />
        ) : (
          <Clock size={20} className="text-gray-600" />
        )}
      </div>

      {/* Layer Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{layer.icon}</span>
          <span className={clsx(
            'text-sm font-semibold transition-colors',
            isComplete && 'text-green-400',
            isActive && 'text-[#6C63FF]',
            isWaiting && 'text-gray-600'
          )}>
            Layer {layer.id}: {layer.label}
          </span>
        </div>
        <p className={clsx(
          'text-xs mt-0.5 transition-colors',
          isActive ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isComplete ? 'Complete' : isActive ? layer.description : 'Waiting...'}
        </p>
      </div>

      {/* Glow effect for active */}
      {isActive && (
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#6C63FF] rounded-full animate-pulse" />
          <span className="w-1.5 h-1.5 bg-[#6C63FF] rounded-full animate-pulse delay-100" />
          <span className="w-1.5 h-1.5 bg-[#6C63FF] rounded-full animate-pulse delay-200" />
        </div>
      )}
    </div>
  );
}

export default function LoadingPipeline({ currentLayer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0D1A]/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 p-6 bg-[#111827] border border-[#2A2A4A] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={20} className="text-[#6C63FF]" />
            <h2 className="text-lg font-bold text-gray-200">XAI Pipeline Running</h2>
          </div>
          <p className="text-xs text-gray-500">Processing your submission through 4 AI layers...</p>
        </div>

        {/* Pipeline Steps */}
        <div className="space-y-2">
          {LAYERS.map((layer, i) => (
            <div key={layer.id}>
              <LayerStep layer={layer} currentLayer={currentLayer} />
              {/* Connecting line */}
              {i < LAYERS.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className={clsx(
                    'w-0.5 h-4 rounded-full transition-colors duration-500',
                    currentLayer > layer.id ? 'bg-green-500/40' : 'bg-[#2A2A4A]'
                  )} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Layer {Math.min(currentLayer, 4)} of 4
          </p>
        </div>
      </div>
    </div>
  );
}
