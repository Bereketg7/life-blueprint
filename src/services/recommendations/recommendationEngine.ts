import { ActivityLog, SleepLog, NutritionLog, MentalHealthLog, Recommendation } from '../../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

type LogBundle = {
  activity: ActivityLog[];
  sleep: SleepLog[];
  nutrition: NutritionLog[];
  mental: MentalHealthLog[];
};

// --- Workout Recommender ---
function workoutRecommender(logs: LogBundle): Recommendation[] {
  const recent = logs.activity.slice(-7);
  const recs: Recommendation[] = [];

  const avgDuration = recent.length
    ? recent.reduce((s, l) => s + l.duration, 0) / recent.length
    : 0;

  if (recent.length < 3) {
    recs.push({
      id: generateId(),
      type: 'workout',
      title: 'Increase Workout Frequency',
      description: "You've logged fewer than 3 workouts this week. Aim for at least 3-4 sessions.",
      confidence: 0.9,
      priority: 8,
      reward: { xp: 100, coins: 20 },
      createdAt: new Date().toISOString(),
    });
  } else if (avgDuration < 30) {
    recs.push({
      id: generateId(),
      type: 'workout',
      title: 'Extend Your Sessions',
      description: `Your average workout is ${Math.round(avgDuration)} min. Try to reach 30–45 min.`,
      confidence: 0.75,
      priority: 6,
      reward: { xp: 75, coins: 15 },
      createdAt: new Date().toISOString(),
    });
  }

  const highIntensity = recent.filter(l => l.intensity === 'high').length;
  if (recent.length >= 3 && highIntensity === recent.length) {
    recs.push({
      id: generateId(),
      type: 'workout',
      title: 'Add a Recovery Day',
      description: 'All recent workouts were high intensity. Schedule a low-intensity recovery day.',
      confidence: 0.85,
      priority: 9,
      reward: { xp: 50, coins: 10 },
      createdAt: new Date().toISOString(),
    });
  }

  return recs;
}

// --- Nutrition Recommender ---
function nutritionRecommender(logs: LogBundle): Recommendation[] {
  const recent = logs.nutrition.slice(-14);
  const recs: Recommendation[] = [];

  if (recent.length < 7) {
    recs.push({
      id: generateId(),
      type: 'nutrition',
      title: 'Track Your Meals Consistently',
      description: 'Log at least 2 meals per day to unlock personalized nutrition insights.',
      confidence: 0.85,
      priority: 7,
      reward: { xp: 80, coins: 15 },
      createdAt: new Date().toISOString(),
    });
  }

  const avgProtein = recent.length
    ? recent.reduce((s, l) => s + l.protein, 0) / recent.length
    : 0;
  if (avgProtein < 25 && recent.length >= 3) {
    recs.push({
      id: generateId(),
      type: 'nutrition',
      title: 'Increase Protein Intake',
      description: `Your avg meal protein is ${Math.round(avgProtein)}g. Aim for 25–40g per meal.`,
      confidence: 0.8,
      priority: 7,
      reward: { xp: 60, coins: 12 },
      createdAt: new Date().toISOString(),
    });
  }

  return recs;
}

// --- Sleep Recommender ---
function sleepRecommender(logs: LogBundle): Recommendation[] {
  const recent = logs.sleep.slice(-7);
  const recs: Recommendation[] = [];

  const avgSleep = recent.length
    ? recent.reduce((s, l) => s + l.duration, 0) / recent.length
    : 0;

  if (avgSleep < 7 && recent.length >= 3) {
    recs.push({
      id: generateId(),
      type: 'sleep',
      title: 'Prioritize More Sleep',
      description: `Your avg sleep is ${avgSleep.toFixed(1)}h. Aim for 7–9 hours nightly.`,
      confidence: 0.9,
      priority: 9,
      reward: { xp: 100, coins: 20 },
      createdAt: new Date().toISOString(),
    });
  }

  const avgQuality = recent.length
    ? recent.reduce((s, l) => s + l.quality, 0) / recent.length
    : 0;
  if (avgQuality < 3 && recent.length >= 3) {
    recs.push({
      id: generateId(),
      type: 'sleep',
      title: 'Improve Sleep Quality',
      description: 'Your sleep quality has been low. Try reducing screen time 1 hour before bed.',
      confidence: 0.75,
      priority: 8,
      reward: { xp: 80, coins: 15 },
      createdAt: new Date().toISOString(),
    });
  }

  return recs;
}

// --- Training Week Recommender ---
function trainingWeekRecommender(logs: LogBundle): Recommendation[] {
  const recs: Recommendation[] = [];
  const recentActivity = logs.activity.slice(-7);
  const types = new Set(recentActivity.map(l => l.type));

  if (!types.has('strength') && recentActivity.length >= 2) {
    recs.push({
      id: generateId(),
      type: 'training_week',
      title: 'Add Strength Training',
      description: 'No strength sessions this week. Add 2 sessions for balanced fitness.',
      confidence: 0.8,
      priority: 7,
      reward: { xp: 90, coins: 18 },
      createdAt: new Date().toISOString(),
    });
  }

  return recs;
}

// --- Main Recommendation Engine ---
export function generateRecommendations(logs: LogBundle): Recommendation[] {
  const all = [
    ...workoutRecommender(logs),
    ...nutritionRecommender(logs),
    ...sleepRecommender(logs),
    ...trainingWeekRecommender(logs),
  ];

  // Sort by priority descending, then confidence
  return all.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.confidence - a.confidence;
  });
}

// --- Feedback Loop ---
const responseStore: Record<string, boolean> = {};

export function recordRecommendationResponse(
  recommendationId: string,
  accepted: boolean,
): void {
  responseStore[recommendationId] = accepted;
}

export function getAcceptanceRate(): number {
  const vals = Object.values(responseStore);
  if (!vals.length) return 0;
  return vals.filter(Boolean).length / vals.length;
}
