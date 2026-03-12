import {
  ActivityLog,
  NutritionLog,
  SleepLog,
  MentalHealthLog,
  RiskAssessment,
} from '../../types';

type AnyLog = ActivityLog | NutritionLog | SleepLog | MentalHealthLog;

function riskLevel(score: number): RiskAssessment['level'] {
  if (score <= 30) return 'low';
  if (score <= 60) return 'moderate';
  if (score <= 80) return 'high';
  return 'critical';
}

/** Assess injury risk based on training load and sleep quality. */
export function assessInjuryRisk(
  activityLogs: ActivityLog[],
  sleepLogs: SleepLog[] = [],
): RiskAssessment {
  const sorted = [...activityLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const recent = sorted.slice(-7);

  let score = 0;
  const factors: string[] = [];
  const recommendations: string[] = [];

  // Consecutive hard workouts
  const hardDays = recent.filter(
    (l) => l.intensity === 'high',
  ).length;
  if (hardDays >= 3) {
    score += 35;
    factors.push(`${hardDays} high-intensity sessions in the last 7 days`);
    recommendations.push('Take at least 2 rest or easy days per week');
  } else if (hardDays === 2) {
    score += 15;
    factors.push('2 consecutive high-intensity workouts detected');
  }

  // High weekly volume
  const totalMinutes = recent.reduce((a, l) => a + (l.duration ?? 0), 0);
  if (totalMinutes > 600) {
    score += 25;
    factors.push(`High weekly volume: ${totalMinutes} minutes`);
    recommendations.push('Reduce weekly training volume by 10–20%');
  }

  // Sleep deprivation increases injury risk
  const recentSleep = sleepLogs.slice(-7);
  if (recentSleep.length > 0) {
    const avgSleep =
      recentSleep.reduce((a, l) => a + l.hoursSlept, 0) / recentSleep.length;
    if (avgSleep < 6) {
      score += 30;
      factors.push(`Average sleep only ${avgSleep.toFixed(1)} hours`);
      recommendations.push('Aim for 7–9 hours of sleep to support muscle recovery');
    }
  }

  if (factors.length === 0) {
    factors.push('Training load is within safe limits');
  }
  if (recommendations.length === 0) {
    recommendations.push('Continue current training pattern');
  }

  const clampedScore = Math.min(100, score);
  return {
    type: 'injury',
    score: clampedScore,
    level: riskLevel(clampedScore),
    factors,
    recommendations,
    assessedAt: new Date().toISOString(),
  };
}

/** Assess burnout risk based on training, sleep and mental health trends. */
export function assessBurnoutRisk(logs: {
  activityLogs: ActivityLog[];
  nutritionLogs: NutritionLog[];
  sleepLogs: SleepLog[];
  mentalHealthLogs: MentalHealthLog[];
}): RiskAssessment {
  const { activityLogs, nutritionLogs, sleepLogs, mentalHealthLogs } = logs;
  let score = 0;
  const factors: string[] = [];
  const recommendations: string[] = [];

  // High training frequency
  const recentActivity = activityLogs.slice(-14);
  const restDays =
    14 - new Set(recentActivity.map((l) => l.date.split('T')[0])).size;
  if (restDays < 2) {
    score += 25;
    factors.push('Fewer than 2 rest days in the past 2 weeks');
    recommendations.push('Schedule at least 2 full rest days per week');
  }

  // Sleep deprivation
  const recentSleep = sleepLogs.slice(-7);
  if (recentSleep.length > 0) {
    const avgSleep =
      recentSleep.reduce((a, l) => a + l.hoursSlept, 0) / recentSleep.length;
    if (avgSleep < 6.5) {
      score += 30;
      factors.push(`Chronic sleep deficit: avg ${avgSleep.toFixed(1)} hrs`);
      recommendations.push('Prioritise 7–9 hours of sleep nightly');
    }
  }

  // Calorie deficit severity (use 2000 as baseline target if unknown)
  const recentNutrition = nutritionLogs.slice(-7);
  if (recentNutrition.length > 0) {
    const avgCalories =
      recentNutrition.reduce((a, l) => a + l.calories, 0) /
      recentNutrition.length;
    const target = 2000;
    const avgDeficit = target - avgCalories;
    if (avgDeficit > 700) {
      score += 20;
      factors.push(`Large caloric deficit: ~${Math.round(avgDeficit)} kcal/day`);
      recommendations.push('Avoid deficits greater than 500 kcal/day');
    }
  }

  // Low mood scores
  const recentMental = mentalHealthLogs.slice(-7);
  if (recentMental.length > 0) {
    const avgMood =
      recentMental.reduce((a, l) => a + l.mood, 0) / recentMental.length;
    if (avgMood < 4) {
      score += 25;
      factors.push(`Low average mood score: ${avgMood.toFixed(1)} / 10`);
      recommendations.push('Consider stress-reduction activities such as meditation');
    }
  }

  if (factors.length === 0) {
    factors.push('No significant burnout indicators detected');
  }
  if (recommendations.length === 0) {
    recommendations.push('Keep up the great balance!');
  }

  const clampedScore = Math.min(100, score);
  return {
    type: 'burnout',
    score: clampedScore,
    level: riskLevel(clampedScore),
    factors,
    recommendations,
    assessedAt: new Date().toISOString(),
  };
}
