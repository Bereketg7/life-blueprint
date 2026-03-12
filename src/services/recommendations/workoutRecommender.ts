import { ActivityLog, UserProfile, Recommendation } from '../../types';

function makeId(): string {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function expiresIn(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

/** Checks for consecutive rest or workout days in a sorted log array. */
function countConsecutiveTail(
  logs: ActivityLog[],
  predicate: (l: ActivityLog) => boolean,
): number {
  const sorted = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  let count = 0;
  for (const log of sorted) {
    if (predicate(log)) count++;
    else break;
  }
  return count;
}

export async function generateWorkoutRecommendation(
  activityLogs: ActivityLog[],
  userProfile: UserProfile,
): Promise<Recommendation> {
  const now = new Date().toISOString();

  const recentDates = new Set(
    activityLogs
      .slice(-7)
      .map((l) => new Date(l.date).toISOString().split('T')[0]),
  );

  // Determine rest-day streak (days with no logged activity)
  const consecutiveRestDays = (() => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (!recentDates.has(key)) streak++;
      else break;
    }
    return streak;
  })();

  // Consecutive hard workouts
  const consecutiveHardWorkouts = countConsecutiveTail(
    activityLogs,
    (l) => l.intensity === 'high',
  );

  if (consecutiveHardWorkouts >= 3) {
    return {
      id: makeId(),
      category: 'recovery',
      title: 'Rest Day Recommended',
      description:
        "You've had 3 or more high-intensity sessions in a row. Your muscles need time to rebuild. Take an active recovery day — light walking or stretching.",
      priority: 'high',
      confidence: 0.88,
      actionType: 'log_rest',
      actionData: { suggestedActivity: 'light_walk', duration: 30 },
      createdAt: now,
      expiresAt: expiresIn(24),
      status: 'active',
    };
  }

  if (consecutiveRestDays >= 2) {
    const goalType = userProfile.goalType ?? 'maintenance';
    const workoutType =
      goalType === 'weight_loss'
        ? 'cardio'
        : goalType === 'muscle_gain'
        ? 'strength'
        : 'mixed';
    return {
      id: makeId(),
      category: 'workout',
      title: "Time to Move – Let's Work Out!",
      description: `It's been ${consecutiveRestDays} days since your last workout. A ${workoutType} session today will keep your momentum going.`,
      priority: consecutiveRestDays >= 4 ? 'high' : 'medium',
      confidence: 0.82,
      actionType: 'start_workout',
      actionData: { workoutType, duration: 45, intensity: 'medium' },
      createdAt: now,
      expiresAt: expiresIn(24),
      status: 'active',
    };
  }

  // Default: balanced recommendation
  return {
    id: makeId(),
    category: 'workout',
    title: 'Keep Your Streak Alive',
    description:
      "You're training consistently. Aim for a moderate 30–45 min session today to maintain your progress.",
    priority: 'low',
    confidence: 0.7,
    actionType: 'start_workout',
    actionData: { workoutType: 'mixed', duration: 40, intensity: 'medium' },
    createdAt: now,
    expiresAt: expiresIn(24),
    status: 'active',
  };
}
