'use client';

import { BarChart3 } from 'lucide-react';
import { getSeverityColor } from '@/lib/utils';
import clsx from 'clsx';

export default function ClassInsights({ misconceptions }) {
  if (!misconceptions || misconceptions.length === 0) return null;

  // Count frequency of each misconception tag
  const tagCounts = {};
  misconceptions.forEach(m => {
    tagCounts[m.display_name] = (tagCounts[m.display_name] || 0) + 1;
  });

  const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const max = sorted.length > 0 ? sorted[0][1] : 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 size={16} className="text-[#6C63FF]" />
        <h3 className="text-sm font-semibold text-gray-300">Misconception Frequency</h3>
      </div>

      <div className="space-y-2">
        {sorted.map(([name, count]) => {
          const m = misconceptions.find(mc => mc.display_name === name);
          const percentage = (count / max) * 100;

          return (
            <div key={name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-[10px] font-medium border',
                  getSeverityColor(m?.severity)
                )}>
                  {name}
                </span>
                <span className="text-xs text-gray-500">{count}x</span>
              </div>
              <div className="w-full h-1.5 bg-[#1A1A2E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6C63FF] rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
