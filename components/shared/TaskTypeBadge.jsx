'use client';

import { Code2, FileText, ListChecks } from 'lucide-react';
import clsx from 'clsx';

const TYPE_CONFIG = {
  code: { icon: Code2, label: 'Code', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  essay: { icon: FileText, label: 'Essay', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  mcq: { icon: ListChecks, label: 'MCQ', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
};

export default function TaskTypeBadge({ type }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.code;
  const Icon = config.icon;

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
      config.color
    )}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}
