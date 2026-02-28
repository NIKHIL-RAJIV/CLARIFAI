'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SubmissionPanel from '@/components/student/SubmissionPanel';
import ScoreCard from '@/components/student/ScoreCard';
import EvidenceHighlighter from '@/components/student/EvidenceHighlighter';
import CounterfactualCard from '@/components/student/CounterfactualCard';
import MisconceptionBadge from '@/components/student/MisconceptionBadge';
import InstructorPanel from '@/components/instructor/InstructorPanel';
import LoadingPipeline from '@/components/shared/LoadingPipeline';
import TaskTypeBadge from '@/components/shared/TaskTypeBadge';
import { BookOpen, GraduationCap, Download, Code2, FileText, ListChecks } from 'lucide-react';
import clsx from 'clsx';
import { downloadReport } from '@/lib/generateReport';

const TABS = [
  { key: 'scores', label: 'Scores' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'coach', label: 'Coach Me' },
  { key: 'profile', label: 'My Profile' },
];

const TASK_ICONS = { code: Code2, essay: FileText, mcq: ListChecks };
const TASK_LABELS = { code: 'Code', essay: 'Essay', mcq: 'MCQ' };

export default function EvaluatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(1);
  const [evaluation, setEvaluation] = useState(null);
  const [activeTab, setActiveTab] = useState('scores');
  const [overrides, setOverrides] = useState({});
  const [activeView, setActiveView] = useState('student');
  const [lastSubmission, setLastSubmission] = useState(null); // { taskType, submission, rubric }

  const handleSubmit = useCallback(async ({ taskType, rubric, submission }) => {
    setIsLoading(true);
    setCurrentLayer(1);
    setEvaluation(null);
    setOverrides({});
    setLastSubmission({ taskType, submission, rubric });

    // Simulate layer progress while waiting for API response
    const layerTimers = [
      setTimeout(() => setCurrentLayer(2), 2000),
      setTimeout(() => setCurrentLayer(3), 4000),
      setTimeout(() => setCurrentLayer(4), 6000),
    ];

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskType, rubric, submission }),
      });

      const data = await response.json();

      if (data.success) {
        setEvaluation(data.evaluation);
        setActiveTab('scores');
      } else {
        console.error('Evaluation failed:', data.error);
        alert(data.error || 'Evaluation failed. Please try again.');
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      layerTimers.forEach(clearTimeout);
      setIsLoading(false);
    }
  }, []);

  const handleOverride = useCallback((criterion, newScore) => {
    setOverrides(prev => ({ ...prev, [criterion]: newScore }));
  }, []);

  const renderStudentResults = () => {
    if (!evaluation) return null;

    return (
      <div>
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#1A1A2E] p-1 rounded-lg">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'flex-1 py-2 text-xs font-medium rounded-md transition-all',
                activeTab === tab.key
                  ? 'bg-[#6C63FF] text-white shadow'
                  : 'text-gray-400 hover:text-gray-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'scores' && (
            <ScoreCard
              scores={evaluation.scores}
              overall_score={evaluation.overall_score}
              summary={evaluation.summary}
            />
          )}
          {activeTab === 'evidence' && (
            <EvidenceHighlighter evidence={evaluation.evidence} />
          )}
          {activeTab === 'coach' && (
            <CounterfactualCard
              counterfactuals={evaluation.counterfactuals}
              quick_win={evaluation.quick_win}
            />
          )}
          {activeTab === 'profile' && (
            <MisconceptionBadge
              misconceptions={evaluation.misconceptions}
              learning_profile={evaluation.learning_profile}
            />
          )}
        </div>
      </div>
    );
  };

  /* Read-only submission viewer for Instructor View */
  const renderSubmissionPreview = () => {
    if (!lastSubmission) return null;
    const { taskType, submission } = lastSubmission;
    const Icon = TASK_ICONS[taskType] || FileText;

    return (
      <div className="bg-[#111827] border border-[#2A2A4A] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon size={18} className="text-[#6C63FF]" />
          <h2 className="text-sm font-bold text-gray-300">
            Student Submission — {TASK_LABELS[taskType] || taskType}
          </h2>
          {evaluation?.task_type && <TaskTypeBadge type={evaluation.task_type} />}
        </div>
        <pre
          className={clsx(
            'w-full max-h-[400px] overflow-auto rounded-lg border border-[#2A2A4A] bg-[#0D0D1A] text-gray-300 p-4 text-sm whitespace-pre-wrap',
            taskType === 'code' ? 'font-mono' : ''
          )}
        >
          {submission}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col">
      <Navbar activeView={activeView} onViewChange={setActiveView} />

      {/* Loading Overlay */}
      {isLoading && <LoadingPipeline currentLayer={currentLayer} />}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Student View ── 2-column on lg+ */}
        {activeView === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column — Submission */}
            <div className="bg-[#111827] border border-[#2A2A4A] rounded-xl p-6 self-start lg:sticky lg:top-20">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-[#6C63FF]" />
                <h2 className="text-lg font-bold text-gray-200">Student Submission</h2>
                {evaluation?.task_type && (
                  <TaskTypeBadge type={evaluation.task_type} />
                )}
              </div>
              <SubmissionPanel onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Right Column — Evaluation Results */}
            <div>
              {evaluation ? (
                <div className="bg-[#111827] border border-[#2A2A4A] rounded-xl p-6">
                  {/* Download Report Button */}
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => downloadReport(evaluation, {}, 'student')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#6C63FF] hover:bg-[#5B54E6] text-white text-xs font-medium rounded-lg transition-colors shadow"
                    >
                      <Download size={14} />
                      Download Report (.docx)
                    </button>
                  </div>
                  {renderStudentResults()}
                </div>
              ) : (
                <div className="bg-[#111827] border border-[#2A2A4A] rounded-xl p-6 flex flex-col items-center justify-center py-20 text-center">
                  <BookOpen size={48} className="text-[#2A2A4A] mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">
                    Evaluation Results
                  </h3>
                  <p className="text-sm text-gray-600 max-w-xs">
                    Submit your assignment on the left to see AI-powered scores,
                    evidence, coaching tips, and your learning profile here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Instructor View ── 2-column: submission preview + audit panel */}
        {activeView === 'instructor' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column — Submission Preview */}
            <div className="self-start lg:sticky lg:top-20">
              {lastSubmission ? (
                renderSubmissionPreview()
              ) : (
                <div className="bg-[#111827] border border-[#2A2A4A] rounded-xl p-6 flex flex-col items-center justify-center py-20 text-center">
                  <FileText size={48} className="text-[#2A2A4A] mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">
                    No Submission Yet
                  </h3>
                  <p className="text-sm text-gray-600 max-w-xs">
                    Switch to Student View and submit an assignment first.
                    The submission will appear here for review.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column — Instructor Audit Panel */}
            <div>
              <div className="bg-[#111827] border border-[#2A2A4A] rounded-xl p-6">
                {evaluation ? (
                  <InstructorPanel
                    evaluation={evaluation}
                    onOverride={handleOverride}
                    overrides={overrides}
                    onDownload={() => downloadReport(evaluation, overrides, 'instructor')}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <GraduationCap size={48} className="text-[#2A2A4A] mb-4" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                      Awaiting Submission...
                    </h3>
                    <p className="text-sm text-gray-600 max-w-xs">
                      Submit a student assignment in the Student View first, then switch
                      here to see the AI evaluation and instructor audit controls.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
