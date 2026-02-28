'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Navbar({ activeView, onViewChange }) {
  return (
    <nav className="sticky top-0 z-40 bg-[#0D0D1A]/90 backdrop-blur-md border-b border-[#2A2A4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles size={20} className="text-[#6C63FF] group-hover:text-[#8B83FF] transition-colors" />
            <span className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">
              ScoreLensAI
            </span>
            <span className="hidden sm:inline text-[10px] text-gray-600 font-medium tracking-wider uppercase ml-1">
              Evaluate. Explain. Empower.
            </span>
          </Link>

          {/* View Toggle (only shown on evaluate page) */}
          {onViewChange && (
            <div className="flex items-center gap-1 bg-[#1A1A2E] rounded-lg p-0.5">
              <button
                onClick={() => onViewChange('student')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === 'student'
                    ? 'bg-[#6C63FF] text-white shadow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => onViewChange('instructor')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === 'instructor'
                    ? 'bg-[#6C63FF] text-white shadow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Instructor View
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
