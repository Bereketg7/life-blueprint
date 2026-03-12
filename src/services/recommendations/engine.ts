import {
  UserProfile,
  ActivityLog,
  NutritionLog,
  SleepLog,
  MentalHealthLog,
  Recommendation,
  RecommendationResponse,
} from '../../types';
import { generateWorkoutRecommendation } from './workoutRecommender';
import { generateNutritionRecommendation } from './nutritionRecommender';
import { generateSleepRecommendation } from './sleepRecommender';

export type RecentLogs = {
  activityLogs: ActivityLog[];
  nutritionLogs: NutritionLog[];
  sleepLogs: SleepLog[];
  mentalHealthLogs: MentalHealthLog[];
};

/** Generates a mindfulness/recovery recommendation based on mood scores. */
function generateMindfulnessRecommendation(
  mentalHealthLogs: MentalHealthLog[],
): Recommendation | null {
  const recent = mentalHealthLogs.slice(-7);
  if (recent.length === 0) return null;

  const avgMood =
    recent.reduce((a, l) => a + l.mood, 0) / recent.length;
  const avgStress =
    recent.reduce((a, l) => a + l.stress, 0) / recent.length;
  const now = new Date().toISOString();
  const exp = new Date();
  exp.setHours(exp.getHours() + 24);

  if (avgMood < 4 || avgStress > 7) {
    return {
      id: `rec_mind_${Date.now()}`,
      category: 'mindfulness',
      title: 'Try a Mindfulness Session',
      description: `Your recent mood (avg ${avgMood.toFixed(1)}/10) and stress levels (avg ${avgStress.toFixed(1)}/10) suggest you could benefit from a 10-minute guided meditation or breathing exercise.`,
      priority: avgStress > 8 ? 'high' : 'medium',
      confidence: 0.8,
      actionType: 'start_meditation',
      actionData: { duration: 10, type: 'breathing' },
      createdAt: now,
      expiresAt: exp.toISOString(),
      status: 'active',
    };
  }
  return null;
}

/**
 * Main entry point – analyses all log categories and returns a sorted,
 * deduplicated list of recommendations.
 */
export async function generateRecommendations(
  userProfile: UserProfile,
  recentLogs: RecentLogs,
): Promise<RecommendationResponse> {
  const { activityLogs, nutritionLogs, sleepLogs, mentalHealthLogs } =
    recentLogs;

  const basedOn: string[] = [];
  if (activityLogs.length > 0) basedOn.push('activity_data');
  if (nutritionLogs.length > 0) basedOn.push('nutrition_data');
  if (sleepLogs.length > 0) basedOn.push('sleep_data');
  if (mentalHealthLogs.length > 0) basedOn.push('mental_health_data');

  const [workoutRec, nutritionRec, sleepRec] = await Promise.all([
    generateWorkoutRecommendation(activityLogs, userProfile),
    generateNutritionRecommendation(nutritionLogs, userProfile),
    generateSleepRecommendation(sleepLogs),
  ]);

  const mindfulnessRec = generateMindfulnessRecommendation(mentalHealthLogs);

  const recommendations: Recommendation[] = [
    workoutRec,
    nutritionRec,
    sleepRec,
    ...(mindfulnessRec ? [mindfulnessRec] : []),
  ];

  // Sort: high → medium → low, then by confidence descending
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    return b.confidence - a.confidence;
  });

  return {
    recommendations,
    generatedAt: new Date().toISOString(),
    basedOn,
  };
}
