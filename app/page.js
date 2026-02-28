import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center max-w-2xl">
        {/* Logo / Title */}
        <div className="mb-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
            ScoreLens<span className="text-[#6C63FF]">AI</span>
          </h1>
          <p className="mt-2 text-lg text-gray-400 font-medium">
            Evaluate. Explain. Empower.
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
          A 4-layer Explainable AI pipeline that evaluates student submissions — code, essays, and MCQs —
          and tells them <span className="text-cyan-400 font-medium">exactly why</span> they received each score,{' '}
          <span className="text-amber-400 font-medium">what to change</span> to improve, and identifies the{' '}
          <span className="text-[#6C63FF] font-medium">underlying misconception</span> causing errors.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { label: 'Rubric Scoring', color: 'border-green-500/30 text-green-400' },
            { label: 'Evidence-Cited', color: 'border-cyan-500/30 text-cyan-400' },
            { label: 'Counterfactual Coaching', color: 'border-amber-500/30 text-amber-400' },
            { label: 'Misconception Tagging', color: 'border-[#6C63FF]/30 text-[#6C63FF]' },
            { label: 'Instructor Audit', color: 'border-purple-500/30 text-purple-400' },
          ].map((f) => (
            <span
              key={f.label}
              className={`px-3 py-1 rounded-full text-xs font-medium border bg-[#1A1A2E] ${f.color}`}
            >
              {f.label}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/evaluate"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6C63FF] text-white font-semibold rounded-lg hover:bg-[#5A52E0] shadow-lg shadow-[#6C63FF]/25 hover:shadow-[#6C63FF]/40 transition-all duration-200 text-sm"
        >
          Start Evaluating
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>

        {/* Tech Stack */}
        <div className="mt-12 text-[10px] text-gray-600 uppercase tracking-widest">
          Next.js · Groq API · Llama 3.3 70B · Tailwind CSS · Vercel
        </div>
      </div>
    </div>
  );
}
