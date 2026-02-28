'use client';

import { useState, useRef } from 'react';
import { Code2, FileText, ListChecks, ChevronDown, ChevronUp, Send, Loader2, Upload, X } from 'lucide-react';
import { RUBRICS, RUBRIC_OPTIONS } from '@/lib/rubrics';
import clsx from 'clsx';

const TASK_TYPES = [
  { key: 'code', label: 'Code', icon: Code2 },
  { key: 'essay', label: 'Essay', icon: FileText },
  { key: 'mcq', label: 'MCQ', icon: ListChecks },
];

const CODE_PLACEHOLDER = `# Paste your Python code here or upload a .py / .ipynb file...
def example_function(n):
    result = []
    for i in range(n):
        result.append(i * 2)
    return result`;

const ESSAY_PLACEHOLDER = `Paste your essay or written assignment here...`;

const MCQ_PLACEHOLDER = `Format your MCQ answers as follows:

Q1: B — Explanation: The answer is B because...
Q2: A — Explanation: I chose A since...
Q3: D — Explanation: This is correct because...`;

/* ── Helper: extract code cells from a .ipynb JSON ── */
function extractNotebookCode(notebookJson) {
  try {
    const nb = JSON.parse(notebookJson);
    const cells = nb.cells || [];
    const codeCells = cells.filter(c => c.cell_type === 'code');
    return codeCells
      .map((c, i) => {
        const source = Array.isArray(c.source) ? c.source.join('') : c.source;
        return `# ── Cell ${i + 1} ──\n${source}`;
      })
      .join('\n\n');
  } catch {
    return notebookJson; // fallback: return raw content
  }
}

export default function SubmissionPanel({ onSubmit, isLoading }) {
  const [taskType, setTaskType] = useState('code');
  const [submission, setSubmission] = useState('');
  const [rubricMode, setRubricMode] = useState('preset'); // 'preset' | 'custom'
  const [selectedRubric, setSelectedRubric] = useState('code_python');
  const [customRubric, setCustomRubric] = useState('');
  const [rubricOpen, setRubricOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null); // { name, size }
  const fileInputRef = useRef(null);

  const filteredRubrics = RUBRIC_OPTIONS.filter(r => r.taskType === taskType);

  const handleTaskTypeChange = (type) => {
    setTaskType(type);
    const defaultRubric = RUBRIC_OPTIONS.find(r => r.taskType === type);
    if (defaultRubric) {
      setSelectedRubric(defaultRubric.value);
    }
  };

  const getPlaceholder = () => {
    switch (taskType) {
      case 'code': return CODE_PLACEHOLDER;
      case 'essay': return ESSAY_PLACEHOLDER;
      case 'mcq': return MCQ_PLACEHOLDER;
      default: return '';
    }
  };

  const getRubricText = () => {
    if (rubricMode === 'custom') return customRubric;
    return RUBRICS[selectedRubric]?.rubric || '';
  };

  /* ── File upload handler ── */
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['py', 'ipynb'].includes(ext)) {
      alert('Only .py and .ipynb files are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      let content = evt.target.result;
      if (ext === 'ipynb') {
        content = extractNotebookCode(content);
      }
      setSubmission(content);
      setUploadedFile({ name: file.name, size: file.size });
      // Auto-switch to code task type when uploading code files
      if (taskType !== 'code') {
        handleTaskTypeChange('code');
      }
    };
    reader.readAsText(file);

    // Reset input so the same file can be re-uploaded
    e.target.value = '';
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    setSubmission('');
  };

  const handleSubmit = () => {
    if (!submission.trim()) return;
    onSubmit({
      taskType,
      rubric: getRubricText(),
      submission: submission.trim(),
    });
  };

  const lineCount = submission.split('\n').length;
  const charCount = submission.length;

  return (
    <div className="space-y-5">
      {/* Task Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Submission Type
        </label>
        <div className="flex gap-2">
          {TASK_TYPES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleTaskTypeChange(key)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                taskType === key
                  ? 'bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/25'
                  : 'bg-[#1A1A2E] text-gray-400 hover:bg-[#252545] hover:text-gray-200'
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Submission Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-400">
            Your Submission
          </label>

          {/* Upload Button */}
          <div className="flex items-center gap-2">
            {uploadedFile && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#6C63FF]/15 border border-[#6C63FF]/30 rounded-lg">
                <Code2 size={12} className="text-[#6C63FF]" />
                <span className="text-[11px] text-[#6C63FF] font-medium max-w-[120px] truncate">
                  {uploadedFile.name}
                </span>
                <button
                  onClick={clearUploadedFile}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A2E] border border-[#2A2A4A] rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:border-[#6C63FF]/50 transition-all"
            >
              <Upload size={13} />
              Upload .py / .ipynb
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".py,.ipynb"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        <textarea
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          placeholder={getPlaceholder()}
          rows={12}
          className={clsx(
            'w-full rounded-lg border border-[#2A2A4A] bg-[#0D0D1A] text-gray-200 placeholder-gray-600 p-4 resize-y focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all',
            taskType === 'code' ? 'font-mono text-sm' : 'text-sm'
          )}
        />
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{lineCount} lines</span>
          <span>{charCount} characters</span>
        </div>
      </div>

      {/* Rubric Section — Collapsible */}
      <div className="border border-[#2A2A4A] rounded-lg overflow-hidden">
        <button
          onClick={() => setRubricOpen(!rubricOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#1A1A2E] text-gray-300 hover:bg-[#252545] transition-colors"
        >
          <span className="text-sm font-medium">Rubric Settings</span>
          {rubricOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {rubricOpen && (
          <div className="p-4 space-y-4 bg-[#0D0D1A]">
            {/* Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setRubricMode('preset')}
                className={clsx(
                  'px-3 py-1.5 rounded text-xs font-medium transition-all',
                  rubricMode === 'preset'
                    ? 'bg-[#6C63FF] text-white'
                    : 'bg-[#1A1A2E] text-gray-400 hover:text-gray-200'
                )}
              >
                Pre-built Rubric
              </button>
              <button
                onClick={() => setRubricMode('custom')}
                className={clsx(
                  'px-3 py-1.5 rounded text-xs font-medium transition-all',
                  rubricMode === 'custom'
                    ? 'bg-[#6C63FF] text-white'
                    : 'bg-[#1A1A2E] text-gray-400 hover:text-gray-200'
                )}
              >
                Custom Rubric
              </button>
            </div>

            {rubricMode === 'preset' ? (
              <div>
                <select
                  value={selectedRubric}
                  onChange={(e) => setSelectedRubric(e.target.value)}
                  className="w-full bg-[#1A1A2E] border border-[#2A2A4A] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50"
                >
                  {filteredRubrics.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                  {filteredRubrics.length === 0 && (
                    <option disabled>No pre-built rubric for this type</option>
                  )}
                </select>
                {RUBRICS[selectedRubric] && (
                  <pre className="mt-2 p-3 bg-[#1A1A2E] rounded text-xs text-gray-500 max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {RUBRICS[selectedRubric].rubric.trim()}
                  </pre>
                )}
              </div>
            ) : (
              <textarea
                value={customRubric}
                onChange={(e) => setCustomRubric(e.target.value)}
                placeholder="Paste your custom rubric here..."
                rows={6}
                className="w-full bg-[#1A1A2E] border border-[#2A2A4A] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 resize-y focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50"
              />
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !submission.trim()}
        className={clsx(
          'w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all duration-200',
          isLoading || !submission.trim()
            ? 'bg-[#2A2A4A] text-gray-500 cursor-not-allowed'
            : 'bg-[#6C63FF] text-white hover:bg-[#5A52E0] shadow-lg shadow-[#6C63FF]/25 hover:shadow-[#6C63FF]/40'
        )}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Evaluating...
          </>
        ) : (
          <>
            <Send size={18} />
            Evaluate Submission
          </>
        )}
      </button>
    </div>
  );
}
