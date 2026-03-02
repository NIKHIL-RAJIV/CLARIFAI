# ScoreLensAI

ScoreLensAI is an explainable AI evaluation platform that grades code,
essays, and MCQs using a structured, rubric-driven pipeline. It delivers
not just scores, but evidence, improvement guidance, and concept-level
diagnosis. The goal is to make educational assessment faster, more
consistent, and genuinely useful for both instructors and students.

------------------------------------------------------------------------

## Key Features

### 4-Layer AI Evaluation Pipeline

-   Rubric-aligned scoring
-   Evidence extraction highlighting decision points
-   Counterfactual improvement suggestions
-   Cognitive misconception tagging

### Multi-Task Support

-   Code evaluation
-   Essay evaluation
-   MCQ evaluation

### Explainable Feedback

Grades are backed by interpretable reasoning rather than opaque scores.

### Custom Rubric Builder

Instructors can define criteria and assign custom weightage per
criterion.

### Instructor Override and Audit

Human-in-the-loop control with documented overrides and transparency.

### Exportable Reports

Download structured evaluation summaries with evidence and coaching
guidance.

------------------------------------------------------------------------

## Problem Statement

Most academic AI graders return opaque scores without evidence,
guidance, improvement path, or cognitive diagnosis. ScoreLensAI
addresses this gap by combining scoring accuracy with structured
explainability, transforming grading into a learning-focused process.

------------------------------------------------------------------------

## How It Works

The evaluation pipeline consists of four sequential layers:

1.  **Structured Scoring**
    Scores each submission according to rubric criteria.

2.  **Evidence Extraction**
    Identifies the exact parts of the submission that justify each
    score.

3.  **Counterfactual Coaching**
    Suggests specific improvements that could increase the score.

4.  **Misconception Detection**\
    Detects conceptual misunderstandings to support deeper learning.

------------------------------------------------------------------------

## Technology Stack

### Frontend

-   Next.js (App Router)
-   React
-   Tailwind CSS

### Backend and API

-   Next.js API Routes
-   Structured JSON outputs

### AI Engine

-   Llama 3.3 70B via Groq
-   High-speed inference with structured responses

### Deployment

-   Vercel

------------------------------------------------------------------------

## Getting Started

### 1. Clone the Repository

``` bash
git clone https://github.com/NIKHIL-RAJIV/SCORELENSAI.git
cd SCORELENSAI
```

### 2. Install Dependencies

``` bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file and add:

    NEXT_PUBLIC_GROQ_API_KEY=<your_groq_key>

### 4. Run the Development Server

``` bash
npm run dev
```

Open `http://localhost:3000` in your browser.

------------------------------------------------------------------------

## Example Workflows

### Default Rubric Evaluation

-   Upload code, essay text, or MCQ responses
-   Select built-in rubric
-   View per-criterion scores with evidence and coaching

### Custom Rubric Evaluation

-   Define criteria and assign custom max marks
-   Submit content
-   Receive weighted scoring based on your grading scheme

------------------------------------------------------------------------

## Output and Dashboard

After evaluation, the dashboard provides:

-   Overall score with per-criterion breakdown
-   Evidence-linked explanations
-   Actionable improvement suggestions
-   Misconception tagging
-   Instructor override controls
-   Downloadable evaluation report

------------------------------------------------------------------------

## Impact

ScoreLensAI reduces grading workload, improves consistency, enhances
feedback clarity, and enables scalable, explainable assessment. It
shifts evaluation from a final score into a continuous learning process.
