// ML prediction engine for health trajectory
import { HealthPrediction } from '../../types';
import { ActivityLog, SleepLog, NutritionLog, UserProfile } from '../../types';

function generateId(): string {
  return `pred_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function predictWeightLoss(
  userId: string,
  profile: UserProfile,
  activityLogs: ActivityLog[],
  nutritionLogs: NutritionLog[]
): HealthPrediction {
  const tdee = calculateTDEE(profile);
  const avgCalories =
    nutritionLogs.length > 0
      ? nutritionLogs.reduce((s, n) => s + n.calories, 0) / nutritionLogs.length
      : tdee;

  const dailyDeficit = Math.max(0, tdee - avgCalories);
  // 1 lb fat ≈ 3500 kcal deficit
  const lbsPerWeek = (dailyDeficit * 7) / 3500;
  const targetWeightLoss = Math.max(0, profile.weight - (profile.weight * 0.9));
  const weeksToGoal = lbsPerWeek > 0 ? targetWeightLoss / lbsPerWeek : 52;
  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + Math.round(weeksToGoal * 7));

  return {
    id: generateId(),
    userId,
    type: 'weight_loss',
    confidence: lbsPerWeek > 0 ? 80 : 40,
    prediction: {
      projectedValue: Math.round(lbsPerWeek * 10) / 10,
      timeframe: `${Math.round(weeksToGoal)} weeks`,
      date: goalDate.toISOString().split('T')[0],
    },
    factors: [
      `Daily caloric deficit: ${Math.round(dailyDeficit)} kcal`,
      `Activity logs: ${activityLogs.length} recent`,
    ],
    createdAt: new Date().toISOString(),
  };
}

export function predictGoalAchievement(
  userId: string,
  goalType: string,
  consistencyScore: number
): HealthPrediction {
  const daysToGoal = Math.round(90 * (1 - consistencyScore / 100) + 30);
  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + daysToGoal);

  return {
    id: generateId(),
    userId,
    type: 'goal_achievement',
    confidence: consistencyScore,
    prediction: {
      projectedValue: consistencyScore,
      timeframe: `${daysToGoal} days`,
      date: goalDate.toISOString().split('T')[0],
    },
    factors: [
      `Consistency score: ${consistencyScore}%`,
      `Goal type: ${goalType}`,
    ],
    createdAt: new Date().toISOString(),
  };
}

function calculateTDEE(profile: UserProfile): number {
  // Mifflin-St Jeor Equation
  let bmr: number;
  if (profile.gender === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };

  return Math.round(bmr * (multipliers[profile.activityLevel] ?? 1.55));
}
