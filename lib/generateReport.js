// lib/generateReport.js
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  Packer,
} from 'docx';
import { saveAs } from 'file-saver';

/* ── Colour helpers (hex strings for shading) ── */
const scoreHex = (s, max = 10) => {
  const pct = (s / max) * 100;
  return pct >= 70 ? '22C55E' : pct >= 40 ? 'F59E0B' : 'EF4444';
};
const severityHex = (sev) =>
  sev === 'high' ? 'EF4444' : sev === 'medium' ? 'F59E0B' : '3B82F6';

const BRAND = '6C63FF';
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const cellBorders = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

/* ── Reusable paragraph builders ── */
const heading = (text, level = HeadingLevel.HEADING_2) =>
  new Paragraph({
    heading: level,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, bold: true, size: level === HeadingLevel.HEADING_1 ? 32 : 26, color: '1A1A2E' })],
  });

const bodyText = (text) =>
  new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text, size: 22, color: '333333' })],
  });

const labelValue = (label, value) =>
  new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22, color: '333333' }),
      new TextRun({ text: String(value), size: 22, color: '555555' }),
    ],
  });

const spacer = () => new Paragraph({ spacing: { after: 60 }, children: [] });

/* ── Table helpers ── */
const headerCell = (text) =>
  new TableCell({
    borders: cellBorders,
    shading: { type: ShadingType.CLEAR, fill: BRAND },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, size: 20, color: 'FFFFFF' })],
      }),
    ],
  });

const dataCell = (text, opts = {}) =>
  new TableCell({
    borders: cellBorders,
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    children: [
      new Paragraph({
        alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({
            text: String(text),
            size: 20,
            color: opts.color || '333333',
            bold: opts.bold || false,
          }),
        ],
      }),
    ],
  });

/* ══════════════════════════════════════════════════════════════
   Main export — generates and downloads the .docx report.
   evaluation : the full evaluation object from the API
   overrides  : { criterion: overriddenScore } (from instructor)
   role       : 'student' | 'instructor'
   ══════════════════════════════════════════════════════════════ */
export async function downloadReport(evaluation, overrides = {}, role = 'student') {
  if (!evaluation) return;

  const {
    scores = [],
    overall_score,
    summary,
    evidence = [],
    counterfactuals = [],
    quick_win,
    misconceptions = [],
    learning_profile,
    task_type,
  } = evaluation;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const children = [];

  /* ── Title block ── */
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({ text: 'ScoreLensAI', size: 44, bold: true, color: BRAND }),
        new TextRun({ text: '  —  Grade Evaluation Report', size: 36, color: '444444' }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: `Generated on ${dateStr} at ${timeStr}`, size: 20, color: '888888', italics: true }),
      ],
    }),
  );

  /* ── Meta ── */
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const totalMax = scores.reduce((sum, s) => sum + (s.max || 10), 0);

  if (task_type) children.push(labelValue('Task Type', task_type));
  children.push(
    labelValue('Overall Score', `${totalScore} / ${totalMax}`),
    labelValue('Report Type', role === 'instructor' ? 'Instructor Audit Report' : 'Student Feedback Report'),
    spacer(),
  );

  /* ── Summary ── */
  if (summary) {
    children.push(heading('Summary'), bodyText(summary), spacer());
  }

  /* ── Scores Table ── */
  children.push(heading('Criterion Scores'));

  const scoreHeaders = role === 'instructor'
    ? ['Criterion', 'AI Score', 'Instructor Score', 'Status']
    : ['Criterion', 'Score', 'Rating'];

  const scoreHeaderRow = new TableRow({
    children: scoreHeaders.map((h) => headerCell(h)),
  });

  const scoreRows = scores.map((s) => {
    const instrScore = overrides[s.criterion];
    const hasOverride = instrScore !== undefined && instrScore !== null;
    const maxMark = s.max || 10;
    const rating = (sc, mx = 10) => {
      const pct = (sc / mx) * 100;
      return pct >= 70 ? 'Excellent' : pct >= 40 ? 'Satisfactory' : 'Needs Improvement';
    };

    if (role === 'instructor') {
      return new TableRow({
        children: [
          dataCell(s.criterion),
          dataCell(`${s.score}/${maxMark}`, { center: true, color: scoreHex(s.score, maxMark), bold: true }),
          dataCell(
            hasOverride ? `${instrScore}/${maxMark}` : '—',
            { center: true, color: hasOverride ? scoreHex(instrScore, maxMark) : '999999', bold: hasOverride },
          ),
          dataCell(hasOverride ? (instrScore === s.score ? 'Agreed' : 'Overridden') : 'Pending', { center: true }),
        ],
      });
    }

    return new TableRow({
      children: [
        dataCell(s.criterion),
        dataCell(`${s.score}/${maxMark}`, { center: true, color: scoreHex(s.score, maxMark), bold: true }),
        dataCell(rating(s.score, maxMark), { center: true }),
      ],
    });
  });

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [scoreHeaderRow, ...scoreRows],
    }),
    spacer(),
  );

  /* ── Evidence ── */
  if (evidence.length > 0) {
    children.push(heading('Evidence per Criterion'));

    evidence.forEach((e) => {
      children.push(
        new Paragraph({
          spacing: { before: 160, after: 60 },
          children: [
            new TextRun({ text: `${e.criterion}`, bold: true, size: 22, color: '1A1A2E' }),
            new TextRun({ text: `  (${e.score}/${e.max || 10} — ${e.sentiment || 'N/A'})`, size: 20, color: '888888' }),
          ],
        }),
        labelValue('Location', e.evidence_location || 'N/A'),
      );
      if (e.evidence_snippet) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text: 'Snippet:', bold: true, size: 20, color: '555555' })],
          }),
          new Paragraph({
            spacing: { after: 80 },
            indent: { left: 360 },
            children: [new TextRun({ text: e.evidence_snippet, size: 18, color: '666666', font: 'Consolas' })],
          }),
        );
      }
      children.push(bodyText(e.explanation || ''));
    });

    children.push(spacer());
  }

  /* ── Counterfactuals / Coaching ── */
  if (counterfactuals.length > 0) {
    children.push(heading('Coaching — "What If" Suggestions'));

    if (quick_win) {
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: '⚡ Quick Win: ', bold: true, size: 22, color: 'D97706' }),
            new TextRun({ text: quick_win, size: 22, color: '555555' }),
          ],
        }),
      );
    }

    const cfHeaderRow = new TableRow({
      children: ['Criterion', 'Difficulty', 'Current', 'Predicted', 'Δ'].map((h) => headerCell(h)),
    });

    const cfRows = counterfactuals.map((cf) =>
      new TableRow({
        children: [
          dataCell(cf.criterion),
          dataCell(cf.difficulty, { center: true }),
          dataCell(`${cf.current_score}/${cf.max || 10}`, { center: true }),
          dataCell(`${cf.predicted_new_score}/${cf.max || 10}`, { center: true, color: '22C55E', bold: true }),
          dataCell(`+${cf.score_delta}`, { center: true, color: '22C55E', bold: true }),
        ],
      }),
    );

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [cfHeaderRow, ...cfRows],
      }),
      spacer(),
    );

    counterfactuals.forEach((cf) => {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [new TextRun({ text: `${cf.criterion} — Suggested Change`, bold: true, size: 22, color: '1A1A2E' })],
        }),
        bodyText(cf.suggested_change),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: 'Why: ', bold: true, size: 20, italics: true, color: '666666' }),
            new TextRun({ text: cf.change_reason, size: 20, color: '666666' }),
          ],
        }),
      );
    });

    children.push(spacer());
  }

  /* ── Misconceptions ── */
  if (misconceptions.length > 0) {
    children.push(heading('Misconceptions Detected'));

    misconceptions.forEach((m) => {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({ text: m.display_name, bold: true, size: 22, color: severityHex(m.severity) }),
            new TextRun({ text: `  [${m.severity}]`, size: 20, color: '999999' }),
          ],
        }),
        bodyText(m.description),
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: 'Remediation: ', bold: true, size: 20, color: '555555' }),
            new TextRun({ text: m.remediation, size: 20, color: '666666' }),
          ],
        }),
      );
    });

    children.push(spacer());
  }

  /* ── Learning Profile ── */
  if (learning_profile) {
    children.push(heading('Learning Profile'), bodyText(learning_profile), spacer());
  }

  /* ── Footer ── */
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: 'Powered by ScoreLensAI — Explainable AI Grading',
          size: 18,
          color: 'AAAAAA',
          italics: true,
        }),
      ],
    }),
  );

  /* ── Build & Download ── */
  const doc = new Document({
    creator: 'ScoreLensAI',
    title: 'ScoreLensAI Grade Evaluation Report',
    description: 'AI-generated evaluation report with evidence and coaching',
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `ScoreLensAI_Report_${role}_${now.toISOString().slice(0, 10)}.docx`;
  saveAs(blob, fileName);
}
