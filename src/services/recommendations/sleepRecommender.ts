import { SleepLog, Recommendation } from '../../types';
import { standardDeviation } from '../analytics/mlModels';

function makeId(): string {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function expiresIn(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

export async function generateSleepRecommendation(
  sleepLogs: SleepLog[],
): Promise<Recommendation> {
  const now = new Date().toISOString();
  const recent = sleepLogs.slice(-7);

  if (recent.length === 0) {
    return {
      id: makeId(),
      category: 'sleep',
      title: 'Start Tracking Your Sleep',
      description:
        'Log your sleep to receive personalised recommendations for better rest and recovery.',
      priority: 'medium',
      confidence: 1.0,
      actionType: 'log_sleep',
      createdAt: now,
      expiresAt: expiresIn(24),
      status: 'active',
    };
  }

  const avgDuration =
    recent.reduce((a, l) => a + l.hoursSlept, 0) / recent.length;
  const durations = recent.map((l) => l.hoursSlept);
  const sdDuration = standardDeviation(durations);

  // Consistently low sleep
  if (avgDuration < 7) {
    const deficit = (7 - avgDuration).toFixed(1);
    return {
      id: makeId(),
      category: 'sleep',
      title: 'Get More Sleep Tonight',
      description: `Your average sleep is ${avgDuration.toFixed(1)} hours — about ${deficit} hours short of the recommended 7–9 hours. Try going to bed ${deficit} hours earlier tonight.`,
      priority: avgDuration < 6 ? 'high' : 'medium',
      confidence: 0.9,
      actionType: 'set_bedtime_reminder',
      actionData: {
        targetHours: 7.5,
        suggestedBedtime: '22:30',
      },
      createdAt: now,
      expiresAt: expiresIn(16),
      status: 'active',
    };
  }

  // Highly inconsistent sleep schedule
  if (sdDuration > 1.5) {
    return {
      id: makeId(),
      category: 'sleep',
      title: 'Establish a Regular Sleep Schedule',
      description: `Your sleep duration varies by ±${sdDuration.toFixed(1)} hours per night. Consistent sleep and wake times improve sleep quality and energy levels. Try keeping a fixed schedule, even on weekends.`,
      priority: 'medium',
      confidence: 0.82,
      actionType: 'set_bedtime_reminder',
      actionData: {
        suggestion: 'fixed_schedule',
        targetBedtime: '22:30',
        targetWakeTime: '06:30',
      },
      createdAt: now,
      expiresAt: expiresIn(24),
      status: 'active',
    };
  }

  // Oversleeping
  if (avgDuration > 9.5) {
    return {
      id: makeId(),
      category: 'sleep',
      title: 'You May Be Oversleeping',
      description: `Averaging ${avgDuration.toFixed(1)} hours of sleep. While rest is important, too much sleep can leave you feeling groggy. Aim for 7–9 hours consistently.`,
      priority: 'low',
      confidence: 0.7,
      actionType: 'set_bedtime_reminder',
      actionData: { targetHours: 8 },
      createdAt: now,
      expiresAt: expiresIn(24),
      status: 'active',
    };
  }

  return {
    id: makeId(),
    category: 'sleep',
    title: 'Sleep Quality Looks Good!',
    description: `You're averaging ${avgDuration.toFixed(1)} hours of sleep — right in the optimal range. Keep it up!`,
    priority: 'low',
    confidence: 0.8,
    actionType: 'log_sleep',
    createdAt: now,
    expiresAt: expiresIn(24),
    status: 'active',
  };
}
