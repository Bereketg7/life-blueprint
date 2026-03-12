import {
  UserProfile,
  ActivityLog,
  NutritionLog,
  Trajectory,
} from '../../types';
import { linearRegression } from './mlModels';
import { DEFAULT_TARGET_CALORIES, KCAL_PER_KG_FAT } from './constants';

/** Predict weight over the next N weeks using caloric data and linear trend. */
export function predictWeightTrajectory(
  profile: UserProfile,
  nutritionLogs: NutritionLog[],
  weeks = 12,
): Trajectory {
  const currentWeight = profile.weight ?? 70;
  const sorted = [...nutritionLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Historical data points: derive weight from caloric deficit
  let weight = currentWeight;
  const historical = sorted.map((log) => {
    const deficit = DEFAULT_TARGET_CALORIES - log.calories;
    weight -= deficit / KCAL_PER_KG_FAT;
    return {
      date: log.date,
      value: parseFloat(weight.toFixed(2)),
      isProjected: false,
    };
  });

  // Trend from recent history
  const recentValues = historical.slice(-14).map((h) => h.value);
  const xs = recentValues.map((_, i) => i);
  const { slope } = linearRegression(xs, recentValues);
  const weeklyChange = slope * 7;

  // Future projection
  const lastDate =
    historical.length > 0
      ? new Date(historical[historical.length - 1].date)
      : new Date();
  const lastValue =
    historical.length > 0 ? historical[historical.length - 1].value : currentWeight;

  const projected = Array.from({ length: weeks }, (_, i) => {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + (i + 1) * 7);
    return {
      date: d.toISOString().split('T')[0],
      value: parseFloat((lastValue + weeklyChange * (i + 1)).toFixed(2)),
      isProjected: true,
    };
  });

  let trend: Trajectory['trend'] = 'stable';
  if (weeklyChange < -0.05) trend = 'declining';
  else if (weeklyChange > 0.05) trend = 'improving';

  return {
    metric: 'weight_kg',
    currentValue: currentWeight,
    projectedValues: [...historical, ...projected],
    trend,
    changePerWeek: parseFloat(weeklyChange.toFixed(3)),
  };
}

/** Estimate the ISO date when the user will reach their goal weight. */
export function predictGoalAchievementDate(
  profile: UserProfile,
  nutritionLogs: NutritionLog[],
): string {
  // Goal weight not on existing type; use a simple 10% reduction as proxy
  const currentWeight = profile.weight ?? 70;
  const goalWeight = currentWeight * 0.9;
  const weightDiff = currentWeight - goalWeight;

  const sorted = [...nutritionLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const deficits = sorted.map((l) => DEFAULT_TARGET_CALORIES - l.calories);
  const avgDailyDeficit =
    deficits.length > 0
      ? deficits.reduce((a, b) => a + b, 0) / deficits.length
      : 250;

  if (avgDailyDeficit <= 0) {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  }

  const daysNeeded = Math.abs((weightDiff * KCAL_PER_KG_FAT) / avgDailyDeficit);
  const target = new Date();
  target.setDate(target.getDate() + Math.round(daysNeeded));
  return target.toISOString().split('T')[0];
}

/** Estimate daily calorie needs using a simplified Mifflin–St Jeor + activity factor. */
export function estimateCalorieNeeds(
  profile: UserProfile,
  activityLogs: ActivityLog[],
): number {
  const weight = profile.weight ?? 70;
  const height = profile.height ?? 170;
  const age = profile.age ?? 30;
  const isMale = profile.gender === 'male';

  // Mifflin–St Jeor BMR
  const bmr = isMale
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  // Average weekly active minutes
  const recentLogs = activityLogs.slice(-7);
  const avgMinutes =
    recentLogs.length > 0
      ? recentLogs.reduce((a, l) => a + l.duration, 0) / recentLogs.length
      : 0;

  let activityFactor = 1.2;
  if (avgMinutes >= 60) activityFactor = 1.725;
  else if (avgMinutes >= 40) activityFactor = 1.55;
  else if (avgMinutes >= 20) activityFactor = 1.375;

  return Math.round(bmr * activityFactor);
}
