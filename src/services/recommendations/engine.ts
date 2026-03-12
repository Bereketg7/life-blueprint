// Smart Recommendations Engine – generates personalized suggestions
import { Recommendation, ActivityLog, NutritionLog, SleepLog, MentalHealthLog } from '../../types';

function generateId(): string {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export interface UserHealthSnapshot {
  userId: string;
  recentActivity: ActivityLog[];
  recentNutrition: NutritionLog[];
  recentSleep: SleepLog[];
  recentMood: MentalHealthLog[];
}

export function generateRecommendations(snapshot: UserHealthSnapshot): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const today = new Date().toISOString();

  // Workout recommendation
  const recentWorkouts = snapshot.recentActivity.filter((a) => a.status === 'completed');
  if (recentWorkouts.length < 3) {
    recommendations.push({
      id: generateId(),
      userId: snapshot.userId,
      type: 'workout',
      title: 'Schedule a Strength Workout',
      description: 'You have done fewer workouts than your target this week.',
      reason: `Only ${recentWorkouts.length} workouts completed recently.`,
      action: { type: 'activity', payload: { type: 'strength', duration: 45 } },
      confidence: 85,
      userResponse: 'pending',
      createdAt: today,
    });
  }

  // Nutrition recommendation
  const avgCalories =
    snapshot.recentNutrition.length > 0
      ? snapshot.recentNutrition.reduce((s, n) => s + n.calories, 0) /
        snapshot.recentNutrition.length
      : 0;
  if (avgCalories < 1500 && avgCalories > 0) {
    recommendations.push({
      id: generateId(),
      userId: snapshot.userId,
      type: 'meal',
      title: 'Increase Caloric Intake',
      description: `Your average calorie intake is ${Math.round(avgCalories)} kcal – consider adding a nutritious snack.`,
      reason: 'Calorie intake below recommended minimum.',
      action: { type: 'nutrition', payload: { suggestion: 'protein-rich snack' } },
      confidence: 78,
      userResponse: 'pending',
      createdAt: today,
    });
  }

  // Sleep recommendation
  const avgSleep =
    snapshot.recentSleep.length > 0
      ? snapshot.recentSleep.reduce((s, sl) => s + sl.hoursSlept, 0) /
        snapshot.recentSleep.length
      : 0;
  if (avgSleep > 0 && avgSleep < 7) {
    recommendations.push({
      id: generateId(),
      userId: snapshot.userId,
      type: 'rest',
      title: 'Prioritise Sleep Tonight',
      description: `Your average sleep is ${avgSleep.toFixed(1)} hours – aim for 7-9 hours.`,
      reason: 'Insufficient sleep detected.',
      action: { type: 'sleep', payload: { targetHours: 8 } },
      confidence: 90,
      userResponse: 'pending',
      createdAt: today,
    });
  }

  // Hydration reminder
  recommendations.push({
    id: generateId(),
    userId: snapshot.userId,
    type: 'hydration',
    title: 'Stay Hydrated',
    description: 'Aim for 8 glasses of water today.',
    reason: 'Daily hydration reminder.',
    action: { type: 'nutrition', payload: { waterGlasses: 8 } },
    confidence: 100,
    userResponse: 'pending',
    createdAt: today,
  });

  // Mood / meditation
  const avgMood =
    snapshot.recentMood.length > 0
      ? snapshot.recentMood.reduce((s, m) => s + m.mood, 0) / snapshot.recentMood.length
      : 5;
  if (avgMood < 5) {
    recommendations.push({
      id: generateId(),
      userId: snapshot.userId,
      type: 'meditation',
      title: '5-Minute Mindfulness Break',
      description: 'Your recent mood scores suggest some stress. A short meditation can help.',
      reason: `Average mood score: ${avgMood.toFixed(1)}/10.`,
      action: { type: 'activity', payload: { type: 'meditation', duration: 5 } },
      confidence: 72,
      userResponse: 'pending',
      createdAt: today,
    });
  }

  return recommendations;
}
