import {
  UserProfile,
  ActivityLog,
  NutritionLog,
  SleepLog,
  MentalHealthLog,
  WeeklyTrainingPlan,
  Recommendation,
} from '../../types';
import { generateWorkoutRecommendation } from './workoutRecommender';
import { generateNutritionRecommendation } from './nutritionRecommender';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

type RecentLogs = {
  activityLogs: ActivityLog[];
  nutritionLogs: NutritionLog[];
  sleepLogs: SleepLog[];
  mentalHealthLogs: MentalHealthLog[];
};

function makeId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateString(d: Date): string {
  return d.toISOString().split('T')[0];
}

/** Generates a 7-day training plan starting from Monday of the current week. */
export async function generateWeeklyPlan(
  userProfile: UserProfile,
  recentLogs: RecentLogs,
): Promise<WeeklyTrainingPlan> {
  const { activityLogs, nutritionLogs } = recentLogs;

  // Find Monday of the current week
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const monday = addDays(today, dayOfWeek === 0 ? -6 : 1 - dayOfWeek);

  // Generate base recommendations once and vary them per day
  const baseWorkout = await generateWorkoutRecommendation(
    activityLogs,
    userProfile,
  );
  const baseNutrition = await generateNutritionRecommendation(
    nutritionLogs,
    userProfile,
  );

  const goalType = userProfile.goalType ?? 'maintenance';

  // Build a 7-day schedule
  // Pattern: workout Mon/Tue/Wed, rest Thu, workout Fri/Sat, rest Sun (adjustable)
  const workoutDays = new Set([0, 1, 2, 4, 5]); // Mon–Wed, Fri–Sat (0-indexed from Mon)
  const restDayNotes: Record<number, string> = {
    3: 'Active recovery day — light stretching or yoga',
    6: 'Full rest day — focus on sleep and hydration',
  };

  const intensities: Array<'low' | 'medium' | 'high'> = [
    'medium',
    'high',
    'medium',
    'low',
    'high',
    'medium',
    'low',
  ];

  const workoutTypes: Record<string, string[]> = {
    weight_loss: ['cardio', 'hiit', 'cardio', 'rest', 'strength', 'cardio', 'rest'],
    muscle_gain: ['strength', 'strength', 'cardio', 'rest', 'strength', 'strength', 'rest'],
    maintenance: ['mixed', 'strength', 'cardio', 'rest', 'mixed', 'cardio', 'rest'],
    endurance: ['cardio', 'cardio', 'strength', 'rest', 'cardio', 'mixed', 'rest'],
    flexibility: ['yoga', 'mixed', 'yoga', 'rest', 'strength', 'yoga', 'rest'],
  };

  const types = workoutTypes[goalType] ?? workoutTypes['maintenance'];

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    const dateStr = toDateString(date);
    const dayName = DAY_NAMES[date.getDay()];
    const isRest = !workoutDays.has(i);
    const workoutType = types[i];

    const workout: Recommendation | undefined = isRest
      ? undefined
      : {
          ...baseWorkout,
          id: `${baseWorkout.id}_day${i}`,
          title: `${dayName} ${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Session`,
          description: `${intensities[i].charAt(0).toUpperCase() + intensities[i].slice(1)}-intensity ${workoutType} workout. Duration: 40–50 min.`,
          priority: intensities[i] === 'high' ? 'high' : intensities[i] === 'medium' ? 'medium' : 'low',
          actionData: {
            workoutType,
            duration: 45,
            intensity: intensities[i],
          },
          createdAt: date.toISOString(),
          expiresAt: new Date(
            date.getTime() + 24 * 60 * 60 * 1000,
          ).toISOString(),
        };

    const nutrition: Recommendation = {
      ...baseNutrition,
      id: `${baseNutrition.id}_day${i}`,
      title: isRest
        ? 'Rest Day Nutrition'
        : `${dayName} Fuelling Strategy`,
      description: isRest
        ? 'On rest days aim for maintenance calories with high protein to support muscle repair.'
        : `Pre-workout: complex carbs. Post-workout: protein + carbs within 30 min. Stay hydrated.`,
      actionData: {
        mealTiming: isRest ? 'maintenance' : 'performance',
        day: dateStr,
      },
      createdAt: date.toISOString(),
      expiresAt: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    };

    return {
      date: dateStr,
      dayOfWeek: dayName,
      workout,
      nutrition,
      notes: restDayNotes[i] ?? '',
    };
  });

  return {
    id: makeId(),
    userId: userProfile.id ?? 'unknown',
    weekStartDate: toDateString(monday),
    days,
    generatedAt: new Date().toISOString(),
  };
}
