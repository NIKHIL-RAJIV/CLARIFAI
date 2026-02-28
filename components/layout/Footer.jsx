'use client';

export default function Footer() {
  return (
    <footer className="border-t border-[#2A2A4A] bg-[#0D0D1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            ClarifAI — Evaluate. Explain. Empower.
          </p>
          <p className="text-xs text-gray-600">
            Built for AMD Slingshot 2025 · AI in Education & Skill
          </p>
        </div>
      </div>
    </footer>
  );
}
