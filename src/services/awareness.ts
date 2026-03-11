import { ConsistencyData, HealthProjection, UserProfile } from '../types';

export function calculateConsistencyScore(
  logs: { completedItems: number; totalItems: number }[]
): ConsistencyData {
  const totalItems = logs.reduce((sum, l) => sum + l.totalItems, 0);
  const completedItems = logs.reduce((sum, l) => sum + l.completedItems, 0);
  const skippedItems = totalItems - completedItems;

  const score = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  let trend: ConsistencyData['trend'] = 'stable';
  if (logs.length >= 6) {
    const recent = logs.slice(-3).reduce((s, l) => s + l.completedItems, 0);
    const previous = logs.slice(-6, -3).reduce((s, l) => s + l.completedItems, 0);
    if (recent > previous) trend = 'improving';
    else if (recent < previous) trend = 'declining';
  }

  return { totalItems, completedItems, skippedItems, score, trend };
}

export function generateHealthProjection(
  profile: UserProfile,
  consistency: ConsistencyData
): HealthProjection[] {
  const consistencyFactor = consistency.score / 100;
  const baseWeight = profile.weight;

  // Weekly weight change rate (kg) based on goal and consistency
  let weeklyChangeMin = 0;
  let weeklyChangeMax = 0;
  if (profile.goalType === 'weight_loss') {
    weeklyChangeMin = -0.5;
    weeklyChangeMax = -1.0;
  } else if (profile.goalType === 'muscle_gain') {
    weeklyChangeMin = 0.25;
    weeklyChangeMax = 0.5;
  }

  const weeklyChange =
    (weeklyChangeMin + weeklyChangeMax) / 2 * consistencyFactor;

  const timeframes: Array<{
    key: HealthProjection['timeframe'];
    weeks: number;
    label: string;
  }> = [
    { key: '1_month', weeks: 4, label: '1 month' },
    { key: '3_months', weeks: 13, label: '3 months' },
    { key: '6_months', weeks: 26, label: '6 months' },
    { key: '12_months', weeks: 52, label: '12 months' },
  ];

  return timeframes.map(({ key, weeks, label }) => {
    const projectedWeight = parseFloat(
      (baseWeight + weeklyChange * weeks).toFixed(1)
    );

    const achievementDate = new Date();
    achievementDate.setDate(achievementDate.getDate() + weeks * 7);

    const insights: string[] = [];

    if (profile.goalType === 'weight_loss') {
      const lost = Math.abs(weeklyChange * weeks);
      insights.push(
        `At your current consistency you could lose ~${lost.toFixed(1)} kg over ${label}.`,
        'Maintaining a calorie deficit of 400–500 kcal/day is key.',
        'Strength training will help preserve muscle during weight loss.'
      );
      if (weeks >= 13) {
        insights.push('Consider a diet break every 8–12 weeks to prevent metabolic adaptation.');
      }
    } else if (profile.goalType === 'muscle_gain') {
      const gained = Math.abs(weeklyChange * weeks);
      insights.push(
        `With consistent training you could gain ~${gained.toFixed(1)} kg of lean mass over ${label}.`,
        'Progressive overload in training is essential for continued growth.',
        'Adequate protein (1.6–2.2 g/kg body weight) is critical.'
      );
      if (weeks >= 26) {
        insights.push('Plan a deload week every 6–8 weeks to allow full recovery.');
      }
    } else if (profile.goalType === 'endurance') {
      insights.push(
        `Your aerobic capacity should improve significantly over ${label}.`,
        'Gradually increase weekly mileage by no more than 10% per week.',
        'Include tempo runs and intervals alongside long slow distance work.'
      );
      if (weeks >= 13) insights.push('Consider entering a local race as a motivational milestone.');
    } else if (profile.goalType === 'flexibility') {
      insights.push(
        `Regular practice over ${label} can dramatically improve your range of motion.`,
        'Consistency is more important than intensity — daily stretching beats occasional sessions.',
        'Proprioceptive neuromuscular facilitation (PNF) stretching yields the fastest gains.'
      );
    } else {
      insights.push(
        `Maintaining current habits over ${label} supports long-term health.`,
        'Mix strength, cardio, and mobility work for balanced fitness.',
        'Monitor key markers (weight, resting HR) to stay on track.'
      );
    }

    return {
      timeframe: key,
      projectedWeight,
      goalAchievementDate: achievementDate.toISOString().split('T')[0],
      consistencyScore: consistency.score,
      insights,
    };
  });
}

export function predictiveWarnings(
  consistency: ConsistencyData,
  profile: UserProfile
): string[] {
  const warnings: string[] = [];

  if (consistency.score < 50) {
    warnings.push(
      "You're completing less than half your planned activities — try reducing plan complexity."
    );
  }

  if (consistency.trend === 'declining') {
    warnings.push(
      'Your consistency has been declining this week. Identify barriers and address them early.'
    );
  }

  if (profile.healthConditions.includes('hypertension')) {
    warnings.push(
      'With hypertension, monitor your blood pressure before and after intense exercise.'
    );
  }

  if (profile.healthConditions.includes('diabetes')) {
    warnings.push(
      'With diabetes, check blood glucose levels before and after workouts and carry fast-acting carbs.'
    );
  }

  if (profile.healthConditions.includes('heart_disease')) {
    warnings.push(
      'Given your heart condition, keep exercise intensity moderate and consult your doctor regularly.'
    );
  }

  if (consistency.score === 0 && consistency.totalItems > 0) {
    warnings.push(
      'No activities completed recently — even a 10-minute walk counts and helps rebuild momentum.'
    );
  }

  return warnings;
}

export function momentumMessage(consistency: ConsistencyData): string {
  if (consistency.score >= 80) {
    return "🔥 You're on fire! Keep this momentum going!";
  }
  if (consistency.score >= 60) {
    return "💪 Great progress! You're building strong habits.";
  }
  if (consistency.score >= 40) {
    return '📈 You\'re making progress. Every step counts!';
  }
  return "🌱 It's time to recommit. Small steps lead to big changes.";
}
