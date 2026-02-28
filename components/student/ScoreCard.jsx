'use client';

import { useEffect, useState } from 'react';
import { getScoreColor, getScoreBgColor, formatScore } from '@/lib/utils';

function CircularGauge({ score, max = 10 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = (animatedScore / max) * 100;
  const circumference = 2 * Math.PI * 54; // radius = 54
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const color = score >= 7 ? '#22c55e' : score >= 4 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke="#1A1A2E"
          strokeWidth="8"
        />
        {/* Score arc */}
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-500">/ {max}</span>
      </div>
    </div>
  );
}

function ScoreBar({ criterion, score, max = 10, index }) {
  const [width, setWidth] = useState(0);
  const percentage = (score / max) * 100;
  const color = score >= 7 ? '#22c55e' : score >= 4 ? '#f59e0b' : '#ef4444';

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100 + index * 100);
    return () => clearTimeout(timer);
  }, [percentage, index]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300">{criterion}</span>
        <span className="text-sm font-semibold" style={{ color }}>
          {formatScore(score, max)}
        </span>
      </div>
      <div className="w-full h-2.5 bg-[#1A1A2E] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            backgroundColor: color,
            transition: 'width 600ms ease-in',
          }}
        />
      </div>
    </div>
  );
}

export default function ScoreCard({ scores, overall_score, summary }) {
  if (!scores || scores.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Overall Score Gauge */}
      <div className="flex flex-col items-center py-4">
        <CircularGauge score={overall_score} />
        <p className="mt-3 text-sm font-medium text-gray-400">Overall Score</p>
      </div>

      {/* Per-Criterion Bars */}
      <div className="space-y-4">
        {scores.map((s, i) => (
          <ScoreBar
            key={s.criterion}
            criterion={s.criterion}
            score={s.score}
            max={s.max || 10}
            index={i}
          />
        ))}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mt-4 p-4 bg-[#1A1A2E] rounded-lg border border-[#2A2A4A]">
          <p className="text-sm text-gray-400 leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
}
