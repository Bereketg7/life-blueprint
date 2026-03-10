import { AwarenessEntry } from '../../types';

export function calculateAverageScore(entries: AwarenessEntry[]): number {
  if (entries.length === 0) return 0;
  const total = entries.reduce((sum, entry) => sum + entry.score, 0);
  return Math.round((total / entries.length) * 10) / 10;
}

export function getScoreTrend(entries: AwarenessEntry[]): 'improving' | 'declining' | 'stable' {
  if (entries.length < 2) return 'stable';
  const recent = entries.slice(0, Math.ceil(entries.length / 2));
  const older = entries.slice(Math.ceil(entries.length / 2));
  const recentAvg = calculateAverageScore(recent);
  const olderAvg = calculateAverageScore(older);
  if (recentAvg > olderAvg + 0.5) return 'improving';
  if (recentAvg < olderAvg - 0.5) return 'declining';
  return 'stable';
}

export function getInsightMessage(score: number): string {
  if (score >= 8) return 'Excellent progress! Keep up the great work.';
  if (score >= 6) return 'Good momentum. Small consistent steps will get you there.';
  if (score >= 4) return 'There is room to grow. Consider setting specific action items.';
  return 'This area needs attention. Start with one small achievable goal.';
}