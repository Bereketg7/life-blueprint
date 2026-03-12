import {
  ConsistencyScore,
  HealthProjection,
  ActivityLog,
  SleepLog,
  NutritionLog,
  MentalHealthLog,
} from '../types';

type LogBundle = {
  activity: ActivityLog[];
  sleep: SleepLog[];
  nutrition: NutritionLog[];
  mental: MentalHealthLog[];
};

/**
 * Scores each wellness category 0-100 based on the fraction of days logged
 * within the look-back window, then combines into a weighted overall score.
 *
 * Weights: activity 30%, nutrition 30%, sleep 25%, mental 15%
 */
export function calculateConsistencyScore(logs: LogBundle, daysBack: number): ConsistencyScore {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysBack);

  const inWindow = (date: string) => new Date(date) >= cutoff;

  const uniqueDays = (entries: { date: string }[]) =>
    new Set(entries.filter(e => inWindow(e.date)).map(e => e.date)).size;

  const activityDays = uniqueDays(logs.activity);
  const sleepDays = uniqueDays(logs.sleep);
  const nutritionDays = uniqueDays(logs.nutrition);
  const mentalDays = uniqueDays(logs.mental);

  // Exercise target: 5 of 7 days is perfect; sleep, nutrition, mental: daily
  const activityScore = Math.min(100, Math.round((activityDays / (daysBack * (5 / 7))) * 100));
  const sleepScore = Math.min(100, Math.round((sleepDays / daysBack) * 100));
  const nutritionScore = Math.min(100, Math.round((nutritionDays / daysBack) * 100));
  const mentalScore = Math.min(100, Math.round((mentalDays / daysBack) * 100));

  const overall = Math.round(
    activityScore * 0.3 + nutritionScore * 0.3 + sleepScore * 0.25 + mentalScore * 0.15,
  );

  const trend = calculateTrend(logs, daysBack);
  const weeklyBreakdown = buildWeeklyBreakdown(logs, daysBack);

  return {
    overall,
    activity: activityScore,
    nutrition: nutritionScore,
    sleep: sleepScore,
    mental: mentalScore,
    trend,
    weeklyBreakdown,
  };
}

/**
 * Projects future consistency scores and estimates a goal-completion date
 * based on the current trajectory.
 */
export function generateHealthProjection(
  score: ConsistencyScore,
  goal: string,
  currentWeight?: number,
  targetWeight?: number,
): HealthProjection {
  const { overall, trend } = score;

  // Monthly score delta based on trend
  const monthlyDelta =
    trend === 'improving' ? 5 : trend === 'declining' ? -3 : 1;

  const project = (months: number) =>
    Math.min(100, Math.max(0, Math.round(overall + monthlyDelta * months)));

  const projected3m = project(3);
  const projected6m = project(6);
  const projected1y = project(12);

  const goalReachDate = estimateGoalDate(score, goal, currentWeight, targetWeight);

  const keyInsights = buildKeyInsights(score, goal);
  // Derive score-based warnings without requiring raw logs
  const warnings = buildScoreWarnings(score);

  return {
    currentScore: overall,
    projectedScore3Month: projected3m,
    projectedScore6Month: projected6m,
    projectedScore1Year: projected1y,
    goalReachDate,
    keyInsights,
    warnings,
  };
}

/**
 * Analyses recent log data and returns specific, actionable warning strings
 * when patterns suggest health risks.
 */
export function predictiveWarnings(logs: LogBundle): string[] {
  const warnings: string[] = [];
  const last7Days = getDateRange(7);
  const last7Set = new Set(last7Days);

  // Sleep warnings
  if (logs.sleep.length > 0) {
    const recentSleep = logs.sleep.filter(s => last7Set.has(s.date));
    if (recentSleep.length > 0) {
      const avgSleep = recentSleep.reduce((sum, s) => sum + s.duration, 0) / recentSleep.length;
      if (avgSleep < 5) {
        warnings.push('⚠️ Averaging under 5 hours sleep – this significantly weakens immune function and cognitive performance.');
      } else if (avgSleep < 6.5) {
        warnings.push('⚠️ Averaging less than 6.5 hours sleep – recovery and muscle repair are being compromised.');
      }

      const lowQualityNights = recentSleep.filter(s => s.quality <= 2).length;
      if (lowQualityNights >= 3) {
        warnings.push('⚠️ 3 or more nights of poor sleep quality detected – consider evaluating stress levels or sleep environment.');
      }
    }
  }

  // Activity warnings
  if (logs.activity.length > 0) {
    const loggedDays = new Set(logs.activity.filter(a => last7Set.has(a.date)).map(a => a.date)).size;
    const missingDays = 7 - Math.min(loggedDays, 7);
    if (missingDays >= 3) {
      warnings.push(`⚠️ Missing ${missingDays} days of exercise this week – metabolic momentum begins to decline after 72 hours of inactivity.`);
    }

    const highIntensityCount = logs.activity.filter(a => last7Set.has(a.date) && a.intensity === 'high').length;
    if (highIntensityCount >= 5) {
      warnings.push('⚠️ 5+ high-intensity sessions detected in 7 days – consider adding deload days to prevent overtraining syndrome.');
    }
  } else {
    warnings.push('⚠️ No activity logged recently – even a 10-minute walk helps maintain cardiovascular health.');
  }

  // Nutrition warnings
  if (logs.nutrition.length > 0) {
    const recentNutrition = logs.nutrition.filter(n => last7Set.has(n.date));
    if (recentNutrition.length > 0) {
      const dayCount = Math.max(new Set(recentNutrition.map(n => n.date)).size, 1);
      const avgCalories = recentNutrition.reduce((sum, n) => sum + n.calories, 0) / dayCount;
      if (avgCalories < 1200) {
        warnings.push('⚠️ Average daily calorie intake appears very low (< 1200 kcal) – risk of nutritional deficiency and metabolic adaptation.');
      }
      const avgProtein = recentNutrition.reduce((sum, n) => sum + n.protein, 0) / dayCount;
      if (avgProtein < 50) {
        warnings.push('⚠️ Low protein intake detected – aim for at least 0.8 g/kg body weight to preserve muscle mass.');
      }
    }
  }

  // Mental health warnings
  if (logs.mental.length > 0) {
    const recentMental = logs.mental.filter(m => last7Set.has(m.date));
    if (recentMental.length > 0) {
      const avgMood = recentMental.reduce((sum, m) => sum + m.mood, 0) / recentMental.length;
      const avgStress = recentMental.reduce((sum, m) => sum + m.stressLevel, 0) / recentMental.length;
      if (avgMood <= 2) {
        warnings.push('⚠️ Consistently low mood detected this week – consider speaking with a healthcare professional if this persists.');
      }
      if (avgStress >= 4) {
        warnings.push('⚠️ High stress levels detected – chronic stress elevates cortisol, disrupting sleep and recovery.');
      }
    }
  }

  return warnings;
}

/**
 * Returns a motivational message calibrated to the user's momentum level.
 * ≥90% = high momentum, 70–89% = steady, <70% = deviation warning
 */
export function momentumMessage(
  consistencyScore: number,
  goalType: string,
  projectedGoalDate?: string,
): string {
  const goalLabel = friendlyGoalLabel(goalType);
  const dateClause = projectedGoalDate ? ` You're on track to reach your ${goalLabel} goal by ${projectedGoalDate}.` : '';

  if (consistencyScore >= 90) {
    return `🔥 Outstanding momentum! You're in the top tier of consistency.${dateClause} Keep this up and results are inevitable.`;
  }

  if (consistencyScore >= 70) {
    return `💪 Steady progress on your ${goalLabel} journey.${dateClause} One more consistent week and you'll hit the next milestone.`;
  }

  if (consistencyScore >= 50) {
    return `📈 You're at ${consistencyScore}% consistency — every healthy choice matters. Recommit to your ${goalLabel} goal with one small win today.`;
  }

  return `🌱 Consistency at ${consistencyScore}% — your ${goalLabel} goal is still within reach. Focus on just today: log one meal, one workout, and one full night of sleep.`;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function calculateTrend(logs: LogBundle, daysBack: number): 'improving' | 'declining' | 'stable' {
  const half = Math.floor(daysBack / 2);

  const cutoffOlder = new Date();
  cutoffOlder.setDate(cutoffOlder.getDate() - daysBack);
  const cutoffRecent = new Date();
  cutoffRecent.setDate(cutoffRecent.getDate() - half);

  // Score each half independently without calling calculateTrend again
  const olderScore = computeRawScore(logs, cutoffOlder, cutoffRecent, half);
  const recentScore = computeRawScore(logs, cutoffRecent, new Date(), half);

  const delta = recentScore - olderScore;
  if (delta >= 5) return 'improving';
  if (delta <= -5) return 'declining';
  return 'stable';
}

/** Computes the weighted consistency score for a date window without trend. */
function computeRawScore(logs: LogBundle, from: Date, to: Date, days: number): number {
  const inRange = (date: string) => { const d = new Date(date); return d >= from && d <= to; };
  const uniqueDays = (entries: { date: string }[]) =>
    new Set(entries.filter(e => inRange(e.date)).map(e => e.date)).size;

  const a = Math.min(100, Math.round((uniqueDays(logs.activity) / (days * (5 / 7))) * 100));
  const n = Math.min(100, Math.round((uniqueDays(logs.nutrition) / days) * 100));
  const s = Math.min(100, Math.round((uniqueDays(logs.sleep) / days) * 100));
  const m = Math.min(100, Math.round((uniqueDays(logs.mental) / days) * 100));
  return Math.round(a * 0.3 + n * 0.3 + s * 0.25 + m * 0.15);
}

function buildWeeklyBreakdown(logs: LogBundle, daysBack: number): number[] {
  const weeks = Math.ceil(daysBack / 7);
  const result: number[] = [];

  for (let w = 0; w < weeks; w++) {
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - w * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    const inWeek = (date: string) => {
      const d = new Date(date);
      return d >= weekStart && d <= weekEnd;
    };

    const uniqueDays = (entries: { date: string }[]) =>
      new Set(entries.filter(e => inWeek(e.date)).map(e => e.date)).size;

    const aDays = uniqueDays(logs.activity);
    const sDays = uniqueDays(logs.sleep);
    const nDays = uniqueDays(logs.nutrition);
    const mDays = uniqueDays(logs.mental);

    const weekScore = Math.round(
      Math.min(100, (aDays / (7 * (5 / 7))) * 100) * 0.3 +
        Math.min(100, (nDays / 7) * 100) * 0.3 +
        Math.min(100, (sDays / 7) * 100) * 0.25 +
        Math.min(100, (mDays / 7) * 100) * 0.15,
    );
    result.unshift(weekScore); // oldest week first
  }

  return result;
}

function estimateGoalDate(
  score: ConsistencyScore,
  goal: string,
  currentWeight?: number,
  targetWeight?: number,
): string {
  const today = new Date();

  // Weight-based goals: use weekly change of ~0.5 kg/week at 80%+ consistency
  if ((goal === 'weight-loss' || goal === 'muscle-gain') && currentWeight && targetWeight) {
    const diff = Math.abs(targetWeight - currentWeight);
    const weeklyRate = score.overall >= 80 ? 0.5 : score.overall >= 60 ? 0.3 : 0.15;
    const weeksNeeded = Math.ceil(diff / weeklyRate);
    const goalDate = new Date(today);
    goalDate.setDate(today.getDate() + weeksNeeded * 7);
    return goalDate.toISOString().split('T')[0];
  }

  // Behaviour-based goals: estimate months until score reaches 85+
  const monthsNeeded = score.overall >= 85 ? 1 : Math.ceil((85 - score.overall) / 5);
  const goalDate = new Date(today);
  goalDate.setMonth(today.getMonth() + monthsNeeded);
  return goalDate.toISOString().split('T')[0];
}

function buildKeyInsights(score: ConsistencyScore, goal: string): string[] {
  const insights: string[] = [];

  if (score.sleep < 60) {
    insights.push('Sleep consistency is your biggest growth lever — improving it will boost all other scores.');
  } else if (score.sleep >= 85) {
    insights.push('Excellent sleep consistency — this is accelerating your recovery and hormonal health.');
  }

  if (score.nutrition >= 80) {
    insights.push('Strong nutrition tracking — your dietary habits are well aligned with your goal.');
  } else if (score.nutrition < 50) {
    insights.push('Nutrition logging gaps are hiding blind spots in your energy balance.');
  }

  if (score.activity >= 80) {
    insights.push('Consistent training is building a strong aerobic and metabolic base.');
  }

  if (score.overall >= 80) {
    insights.push(`At ${score.overall}% consistency you are in the compound-growth zone — results accelerate from here.`);
  }

  if (score.trend === 'improving') {
    insights.push('Your trend is upward — keep the momentum going.');
  } else if (score.trend === 'declining') {
    insights.push('Consistency has dipped recently — identify one friction point and remove it.');
  }

  return insights;
}

function friendlyGoalLabel(goal: string): string {
  const map: Record<string, string> = {
    'weight-loss': 'weight loss',
    'muscle-gain': 'muscle gain',
    'endurance': 'endurance',
    'flexibility': 'flexibility',
    'general-wellness': 'general wellness',
    'stress-reduction': 'stress reduction',
    'sleep-improvement': 'sleep improvement',
  };
  return map[goal] ?? goal;
}

/** Returns ISO date strings for the past N days (today = index 0). */
function getDateRange(daysBack: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < daysBack; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

/** Derives score-based warnings from a ConsistencyScore (no raw logs required). */
function buildScoreWarnings(score: ConsistencyScore): string[] {
  const warnings: string[] = [];
  if (score.sleep < 50) {
    warnings.push('⚠️ Sleep consistency is critically low – prioritise a regular bedtime and wake time.');
  }
  if (score.activity < 40) {
    warnings.push('⚠️ Activity logging has dropped significantly – missing workouts reduces metabolic momentum.');
  }
  if (score.nutrition < 40) {
    warnings.push('⚠️ Nutrition tracking is inconsistent – blind spots in energy balance can stall progress.');
  }
  if (score.trend === 'declining') {
    warnings.push('⚠️ Overall consistency is trending downward – identify one friction point this week and remove it.');
  }
  return warnings;
}