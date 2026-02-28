'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RUBRICS, RUBRIC_OPTIONS } from '@/lib/rubrics';
import clsx from 'clsx';

export default function RubricInput({ taskType, onRubricChange }) {
  const [mode, setMode] = useState('preset');
  const [selectedKey, setSelectedKey] = useState('code_python');
  const [customRubric, setCustomRubric] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = RUBRIC_OPTIONS.filter(r => r.taskType === taskType);

  const handlePresetChange = (key) => {
    setSelectedKey(key);
    onRubricChange?.(RUBRICS[key]?.rubric || '');
  };

  const handleCustomChange = (text) => {
    setCustomRubric(text);
    onRubricChange?.(text);
  };

  return (
    <div className="border border-[#2A2A4A] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#1A1A2E] text-gray-300 hover:bg-[#252545] transition-colors"
      >
        <span className="text-sm font-medium">Rubric</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="p-4 space-y-3 bg-[#0D0D1A]">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('preset')}
              className={clsx(
                'px-3 py-1.5 rounded text-xs font-medium transition-all',
                mode === 'preset'
                  ? 'bg-[#6C63FF] text-white'
                  : 'bg-[#1A1A2E] text-gray-400 hover:text-gray-200'
              )}
            >
              Pre-built
            </button>
            <button
              onClick={() => setMode('custom')}
              className={clsx(
                'px-3 py-1.5 rounded text-xs font-medium transition-all',
                mode === 'custom'
                  ? 'bg-[#6C63FF] text-white'
                  : 'bg-[#1A1A2E] text-gray-400 hover:text-gray-200'
              )}
            >
              Custom
            </button>
          </div>

          {mode === 'preset' ? (
            <select
              value={selectedKey}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full bg-[#1A1A2E] border border-[#2A2A4A] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50"
            >
              {filtered.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          ) : (
            <textarea
              value={customRubric}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="Paste your custom rubric..."
              rows={5}
              className="w-full bg-[#1A1A2E] border border-[#2A2A4A] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 resize-y focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50"
            />
          )}
        </div>
      )}
    </div>
  );
}
