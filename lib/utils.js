// lib/utils.js — JSON parsing, score helpers

/**
 * Safely parse JSON string, returning null on failure
 */
export function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Get score colour class based on score value (out of 10)
 */
export function getScoreColor(score) {
  if (score >= 7) return 'text-green-400';
  if (score >= 4) return 'text-amber-400';
  return 'text-red-400';
}

/**
 * Get score background colour class
 */
export function getScoreBgColor(score) {
  if (score >= 7) return 'bg-green-500';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-red-500';
}

/**
 * Get score ring colour class for circular gauges
 */
export function getScoreRingColor(score) {
  if (score >= 7) return 'stroke-green-400';
  if (score >= 4) return 'stroke-amber-400';
  return 'stroke-red-400';
}

/**
 * Get difficulty badge colour
 */
export function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

/**
 * Get severity badge colour
 */
export function getSeverityColor(severity) {
  switch (severity) {
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

/**
 * Get sentiment colour
 */
export function getSentimentColor(sentiment) {
  switch (sentiment) {
    case 'positive': return 'text-green-400';
    case 'negative': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

/**
 * Calculate weighted average score
 */
export function calculateOverallScore(scores) {
  if (!scores || scores.length === 0) return 0;
  const total = scores.reduce((sum, s) => sum + s.score, 0);
  return Math.round((total / scores.length) * 10) / 10;
}

/**
 * Format score as fraction
 */
export function formatScore(score, max = 10) {
  return `${score} / ${max}`;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
