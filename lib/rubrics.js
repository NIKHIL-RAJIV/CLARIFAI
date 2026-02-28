// lib/rubrics.js
export const RUBRICS = {
  code_python: {
    label: 'Python Programming Assignment',
    taskType: 'code',
    rubric: `
RUBRIC: Python Programming Assignment (Total: 10 marks each criterion)

1. Correctness (10 marks)
   10: All test cases pass, handles all edge cases correctly
   7-9: Most test cases pass, minor edge cases missed
   4-6: Core logic correct but fails several test cases
   1-3: Significant logical errors, most test cases fail

2. Code Quality & Style (10 marks)
   10: Clean, readable, follows PEP8, meaningful variable names
   7-9: Mostly clean, minor style issues
   4-6: Readable but inconsistent style
   1-3: Poor readability, confusing structure

3. Efficiency (10 marks)
   10: Optimal time/space complexity, no redundant operations
   7-9: Efficient with minor improvements possible
   4-6: Functional but inefficient approach
   1-3: Highly inefficient, brute-force where better exists

4. Documentation (10 marks)
   10: All functions have docstrings, inline comments where needed
   7-9: Most functions documented
   4-6: Some comments present
   1-3: No documentation
    `
  },

  essay_general: {
    label: 'General Essay / Report',
    taskType: 'essay',
    rubric: `
RUBRIC: Essay / Written Assignment (Total: 10 marks each criterion)

1. Thesis & Argument (10 marks)
   10: Clear, specific thesis; every paragraph supports it
   7-9: Clear thesis with mostly strong support
   4-6: Thesis present but argument is inconsistent
   1-3: No clear thesis or argument

2. Evidence & Examples (10 marks)
   10: Strong evidence for all claims, properly cited
   7-9: Good evidence for most claims
   4-6: Some evidence but claims often unsupported
   1-3: Little to no supporting evidence

3. Structure & Organisation (10 marks)
   10: Logical flow, clear intro/body/conclusion, smooth transitions
   7-9: Generally well-structured with minor gaps
   4-6: Basic structure present but disjointed
   1-3: No clear structure

4. Language & Clarity (10 marks)
   10: Clear, precise language, no grammatical errors
   7-9: Clear with minor errors
   4-6: Understandable but several errors
   1-3: Difficult to understand
    `
  },

  mcq_cs: {
    label: 'Computer Science MCQ Test',
    taskType: 'mcq',
    rubric: `
RUBRIC: MCQ Assessment (Total: 10 marks each criterion)

1. Conceptual Accuracy (10 marks)
   10: All answers correct with clear conceptual understanding
   7-9: 70-90% correct, minor conceptual gaps
   4-6: 40-60% correct, partial understanding
   1-3: Below 40% correct, significant misunderstanding

2. Reasoning Quality (10 marks)
   10: Explanations show deep understanding
   7-9: Good reasoning with minor errors
   4-6: Some reasoning present but flawed
   1-3: No reasoning or completely incorrect
    `
  }
};

export const RUBRIC_OPTIONS = Object.entries(RUBRICS).map(([key, val]) => ({
  value: key,
  label: val.label,
  taskType: val.taskType
}));
