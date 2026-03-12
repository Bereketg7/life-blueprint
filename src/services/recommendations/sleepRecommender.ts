// AI sleep recommender
import { Recommendation, SleepLog } from '../../types';

function generateId(): string {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function analyzeRecentSleep(logs: SleepLog[]): {
  avgHours: number;
  avgQuality: number;
  trend: 'improving' | 'declining' | 'stable';
} {
  if (logs.length === 0) {
    return { avgHours: 0, avgQuality: 0, trend: 'stable' };
  }

  const avgHours = logs.reduce((s, l) => s + l.hoursSlept, 0) / logs.length;
  const avgQuality = logs.reduce((s, l) => s + l.quality, 0) / logs.length;

  const half = Math.ceil(logs.length / 2);
  const recentHours = logs.slice(0, half).reduce((s, l) => s + l.hoursSlept, 0) / half;
  const olderHours =
    logs.slice(half).reduce((s, l) => s + l.hoursSlept, 0) / Math.max(logs.length - half, 1);

  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (recentHours > olderHours + 0.5) trend = 'improving';
  else if (recentHours < olderHours - 0.5) trend = 'declining';

  return { avgHours, avgQuality, trend };
}

export function recommendSleep(userId: string, logs: SleepLog[]): Recommendation {
  const { avgHours, trend } = analyzeRecentSleep(logs);

  let title = 'Maintain Your Sleep Schedule';
  let description = 'Keep going to bed and waking up at consistent times.';
  let confidence = 70;

  if (avgHours < 6) {
    title = 'Urgent: Improve Sleep Duration';
    description = `You are averaging only ${avgHours.toFixed(1)} hours of sleep. Aim for 7-9 hours per night.`;
    confidence = 95;
  } else if (trend === 'declining') {
    title = 'Sleep Quality Declining';
    description = 'Your sleep has been decreasing. Try limiting screen time before bed.';
    confidence = 85;
  }

  return {
    id: generateId(),
    userId,
    type: 'rest',
    title,
    description,
    reason: `Average sleep: ${avgHours.toFixed(1)} hours. Trend: ${trend}.`,
    action: { type: 'sleep', payload: { targetHours: 8 } },
    confidence,
    userResponse: 'pending',
    createdAt: new Date().toISOString(),
  };
}
