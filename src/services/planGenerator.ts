import {
  UserProfile,
  WellnessPlan,
  NutritionPlan,
  ExercisePlan,
  RecoveryProtocol,
  PlannedExercise,
} from '../types';

// --- Activity multipliers for TDEE (Mifflin-St Jeor) ---
const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  'sedentary': 1.2,
  'lightly-active': 1.375,
  'moderately-active': 1.55,
  'very-active': 1.725,
  'extra-active': 1.9,
};

/**
 * Calculates daily macro targets using Mifflin-St Jeor BMR → TDEE,
 * then applies a calorie adjustment based on the user's goal.
 */
export function recommendMacros(
  goal: string,
  weightKg: number,
  activityLevel: string,
): { calories: number; protein: number; carbs: number; fat: number } {
  // Simplified gender-neutral BMR approximation (age and height not available in
  // this context). Full Mifflin-St Jeor requires sex, height, and age; callers
  // should use generateWeeklyPlan when a full UserProfile is available.
  const baseBMR = 10 * weightKg + 500;
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.375;
  let tdee = Math.round(baseBMR * multiplier);

  // Adjust calories by goal
  if (goal === 'weight-loss') {
    tdee = Math.round(tdee * 0.8); // 20% deficit
  } else if (goal === 'muscle-gain') {
    tdee = Math.round(tdee * 1.1); // 10% surplus
  }
  // endurance / general-wellness / stress-reduction / sleep-improvement → maintenance

  // Macro split (protein prioritised, then fat, remainder carbs)
  const protein = Math.round(weightKg * (goal === 'muscle-gain' ? 2.2 : 1.8));
  const fat = Math.round((tdee * 0.25) / 9);
  const carbCalories = tdee - protein * 4 - fat * 9;
  const carbs = Math.max(0, Math.round(carbCalories / 4));

  return { calories: tdee, protein, carbs, fat };
}

// --- Exercise libraries by fitness level ---
const BEGINNER_EXERCISES: PlannedExercise[] = [
  { name: 'Bodyweight Squat', type: 'strength', sets: 3, reps: 12, restTime: 60 },
  { name: 'Push-Up (Knee)', type: 'strength', sets: 3, reps: 10, restTime: 60 },
  { name: 'Plank', type: 'strength', duration: 20, restTime: 45, notes: 'Hold 20 s, build each week' },
  { name: 'Brisk Walk', type: 'cardio', duration: 20 },
  { name: 'Cat-Cow Stretch', type: 'flexibility', duration: 5 },
];

const INTERMEDIATE_EXERCISES: PlannedExercise[] = [
  { name: 'Goblet Squat', type: 'strength', sets: 4, reps: 12, restTime: 75 },
  { name: 'Dumbbell Bench Press', type: 'strength', sets: 4, reps: 10, restTime: 75 },
  { name: 'Bent-Over Row', type: 'strength', sets: 4, reps: 10, restTime: 75 },
  { name: 'Romanian Deadlift', type: 'strength', sets: 3, reps: 12, restTime: 75 },
  { name: 'Interval Run', type: 'cardio', duration: 25, notes: '1 min fast / 2 min easy' },
  { name: 'Hip Flexor Stretch', type: 'flexibility', duration: 5 },
];

const ADVANCED_EXERCISES: PlannedExercise[] = [
  { name: 'Barbell Back Squat', type: 'strength', sets: 5, reps: 5, restTime: 120 },
  { name: 'Deadlift', type: 'strength', sets: 4, reps: 5, restTime: 180 },
  { name: 'Weighted Pull-Up', type: 'strength', sets: 4, reps: 8, restTime: 90 },
  { name: 'Incline Bench Press', type: 'strength', sets: 4, reps: 8, restTime: 90 },
  { name: 'HIIT Sprint Intervals', type: 'cardio', duration: 20, notes: '20 s on / 40 s off × 8' },
  { name: 'Foam Roll & Mobility', type: 'flexibility', duration: 10 },
];

const ENDURANCE_EXERCISES: PlannedExercise[] = [
  { name: 'Steady-State Run', type: 'cardio', duration: 40 },
  { name: 'Cycling', type: 'cardio', duration: 45 },
  { name: 'Swimming Laps', type: 'cardio', duration: 30 },
  { name: 'Jump Rope', type: 'cardio', duration: 15 },
  { name: 'Dynamic Stretching', type: 'flexibility', duration: 10 },
];

const FLEXIBILITY_EXERCISES: PlannedExercise[] = [
  { name: 'Sun Salutation', type: 'flexibility', duration: 15 },
  { name: 'Yoga Flow (Vinyasa)', type: 'flexibility', duration: 30 },
  { name: 'Pigeon Pose', type: 'flexibility', duration: 5, notes: 'Hold 60 s each side' },
  { name: 'Seated Forward Fold', type: 'flexibility', duration: 3 },
  { name: 'Thoracic Rotations', type: 'flexibility', duration: 5 },
];

/**
 * Returns an ExercisePlan tailored to the user's fitness level, goal,
 * and available session time.
 */
export function prescribeExercise(
  fitnessLevel: string,
  goal: string,
  timeAvailableMinutes: number,
): ExercisePlan {
  let baseExercises: PlannedExercise[];
  let sessionsPerWeek: number;
  let intensity: 'low' | 'moderate' | 'high';
  let focus: string;

  // Choose base library by goal first, then fitness level
  if (goal === 'endurance') {
    baseExercises = ENDURANCE_EXERCISES;
    focus = 'Cardiovascular endurance & aerobic capacity';
  } else if (goal === 'flexibility') {
    baseExercises = FLEXIBILITY_EXERCISES;
    focus = 'Mobility, flexibility & mind-body connection';
  } else {
    switch (fitnessLevel) {
      case 'advanced':
        baseExercises = ADVANCED_EXERCISES;
        break;
      case 'intermediate':
        baseExercises = INTERMEDIATE_EXERCISES;
        break;
      default:
        baseExercises = BEGINNER_EXERCISES;
    }
    focus =
      goal === 'muscle-gain'
        ? 'Hypertrophy & progressive overload'
        : goal === 'weight-loss'
        ? 'Caloric expenditure & metabolic conditioning'
        : 'Full-body fitness & general wellness';
  }

  // Determine intensity
  if (fitnessLevel === 'advanced' || goal === 'muscle-gain') {
    intensity = 'high';
  } else if (fitnessLevel === 'beginner' || goal === 'stress-reduction' || goal === 'sleep-improvement') {
    intensity = 'low';
  } else {
    intensity = 'moderate';
  }

  // Sessions per week based on time budget
  if (timeAvailableMinutes >= 60) {
    sessionsPerWeek = fitnessLevel === 'beginner' ? 3 : 5;
  } else if (timeAvailableMinutes >= 30) {
    sessionsPerWeek = fitnessLevel === 'beginner' ? 3 : 4;
  } else {
    sessionsPerWeek = 3;
  }

  // Rest days spread across the week (0 = Sunday … 6 = Saturday)
  const restDays = getRestDays(sessionsPerWeek);

  // Trim exercises to fit session duration (rough 8-min per exercise estimate)
  const maxExercises = Math.max(2, Math.floor(timeAvailableMinutes / 8));
  const exercises = baseExercises.slice(0, maxExercises);

  return {
    sessionsPerWeek,
    sessionDuration: timeAvailableMinutes,
    exercises,
    intensity,
    focus,
    restDays,
  };
}

function getRestDays(sessionsPerWeek: number): number[] {
  const allDays = [0, 1, 2, 3, 4, 5, 6];
  const restCount = 7 - sessionsPerWeek;
  // Spread rest days: always include Sunday (0) if possible, then mid-week
  const spread = [0, 3, 6, 2, 5, 1, 4];
  return spread.slice(0, restCount).sort((a, b) => a - b);
}

/**
 * Suggests a RecoveryProtocol based on the user's current sleep and fatigue.
 */
export function suggestRecoveryProtocol(
  avgSleepHours: number,
  avgFatigue: number, // 1-5 scale, 5 = very fatigued
): RecoveryProtocol {
  const sleepGoal = avgSleepHours < 7 ? Math.min(avgSleepHours + 1, 9) : avgSleepHours;

  const stressManagement: string[] = [
    'Practice 5-minute box breathing before bed',
    'Limit screen time 1 hour before sleep',
    'Journal 3 things you are grateful for each night',
  ];

  const recoveryActivities: string[] = ['Light stretching (10 min)', 'Cold/contrast shower post-workout'];

  const supplementRecommendations: string[] = ['Magnesium glycinate (300 mg before bed)', 'Vitamin D3 (2000 IU with breakfast)'];

  if (avgFatigue >= 4) {
    stressManagement.push('Consider a full rest day before your next session');
    stressManagement.push('10-minute guided meditation (Headspace / Calm)');
    recoveryActivities.push('Foam rolling – full body (15 min)');
    recoveryActivities.push('Epsom salt bath (20 min)');
    supplementRecommendations.push('Ashwagandha (600 mg with evening meal)');
  }

  if (avgFatigue >= 3) {
    recoveryActivities.push('Yoga nidra or body-scan meditation before sleep');
  }

  if (avgSleepHours < 6) {
    stressManagement.unshift('Prioritise sleep — aim for a consistent bedtime');
    supplementRecommendations.push('L-Theanine (200 mg) 30 min before bed');
  }

  return {
    sleepGoal,
    stressManagement,
    recoveryActivities,
    supplementRecommendations,
  };
}

/**
 * Generates a complete WellnessPlan for the given user and week number.
 */
export function generateWeeklyPlan(userProfile: UserProfile, weekNumber: number): WellnessPlan {
  const macros = recommendMacros(userProfile.primaryGoal, userProfile.weight, userProfile.activityLevel);

  const exercisePlan = prescribeExercise(
    userProfile.fitnessLevel,
    userProfile.primaryGoal,
    userProfile.timeAvailablePerDay,
  );

  // Estimate average fatigue from activity level (proxy; real data would come from logs)
  const activityFatigueProxy: Record<string, number> = {
    'sedentary': 1,
    'lightly-active': 2,
    'moderately-active': 3,
    'very-active': 4,
    'extra-active': 5,
  };
  const estimatedFatigue = activityFatigueProxy[userProfile.activityLevel] ?? 2;
  const recoveryProtocol = suggestRecoveryProtocol(userProfile.sleepGoal, estimatedFatigue);

  const nutritionPlan: NutritionPlan = buildNutritionPlan(macros, userProfile);

  const startDate = getISODateOffset(0);
  const endDate = getISODateOffset(6);

  const weeklyGoals = buildWeeklyGoals(userProfile, weekNumber);

  return {
    id: `plan-${userProfile.userId}-w${weekNumber}`,
    userId: userProfile.userId,
    weekNumber,
    startDate,
    endDate,
    nutritionPlan,
    exercisePlan,
    recoveryProtocol,
    weeklyGoals,
    notes: `Week ${weekNumber} plan generated based on ${userProfile.primaryGoal} goal and ${userProfile.fitnessLevel} fitness level.`,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Adapts an existing plan based on recent performance data.
 * Increases intensity when performing well; eases back when recovery is poor.
 */
export function adaptPlanBasedOnData(
  currentPlan: WellnessPlan,
  consistencyScore: number, // 0-100
  avgSleepHours: number,
  avgMood: number, // 1-5
): WellnessPlan {
  const plan = deepClonePlan(currentPlan);
  const { exercisePlan, nutritionPlan } = plan;

  const isHighPerforming = consistencyScore >= 80 && avgSleepHours >= 7 && avgMood >= 4;
  const isStruggling = consistencyScore < 60 || avgSleepHours < 6 || avgMood <= 2;

  if (isHighPerforming) {
    // Progress: add one session, increase intensity
    exercisePlan.sessionsPerWeek = Math.min(exercisePlan.sessionsPerWeek + 1, 6);
    if (exercisePlan.intensity === 'low') exercisePlan.intensity = 'moderate';
    else if (exercisePlan.intensity === 'moderate') exercisePlan.intensity = 'high';

    nutritionPlan.dailyCalories = Math.round(nutritionPlan.dailyCalories * 1.05);
    nutritionPlan.proteinGrams = Math.round(nutritionPlan.proteinGrams * 1.05);
    plan.notes += ' ↑ Intensity progressed due to strong consistency.';
  } else if (isStruggling) {
    // Deload: reduce sessions, drop intensity, add rest day
    exercisePlan.sessionsPerWeek = Math.max(exercisePlan.sessionsPerWeek - 1, 2);
    if (exercisePlan.intensity === 'high') exercisePlan.intensity = 'moderate';
    else if (exercisePlan.intensity === 'moderate') exercisePlan.intensity = 'low';

    nutritionPlan.dailyCalories = Math.round(nutritionPlan.dailyCalories * 0.97);
    plan.recoveryProtocol.sleepGoal = Math.min(plan.recoveryProtocol.sleepGoal + 0.5, 9);
    plan.notes += ' ↓ Intensity reduced — focus on rest and recovery this week.';
  } else {
    plan.notes += ' → Maintaining current plan — steady progress detected.';
  }

  // Update rest days to reflect new session count
  exercisePlan.restDays = getRestDays(exercisePlan.sessionsPerWeek);

  return plan;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildNutritionPlan(
  macros: { calories: number; protein: number; carbs: number; fat: number },
  profile: UserProfile,
): NutritionPlan {
  const mealTiming =
    profile.primaryGoal === 'muscle-gain'
      ? ['7:00 AM – Breakfast', '10:30 AM – Pre-Workout Snack', '1:00 PM – Lunch', '4:00 PM – Post-Workout Shake', '7:00 PM – Dinner']
      : ['7:30 AM – Breakfast', '12:30 PM – Lunch', '3:30 PM – Snack', '7:00 PM – Dinner'];

  const recommendedFoods =
    profile.primaryGoal === 'weight-loss'
      ? ['Leafy greens', 'Lean chicken / fish', 'Oats', 'Eggs', 'Sweet potato', 'Greek yoghurt']
      : ['Rice', 'Oats', 'Chicken breast', 'Salmon', 'Whole eggs', 'Cottage cheese', 'Quinoa', 'Avocado'];

  const foodsToAvoid = [
    'Processed / ultra-processed foods',
    'Sugary beverages',
    ...(profile.dietaryRestrictions ?? []),
  ];

  const supplements =
    profile.primaryGoal === 'muscle-gain'
      ? ['Whey protein', 'Creatine monohydrate (5 g/day)', 'Omega-3 fish oil']
      : ['Omega-3 fish oil', 'Multivitamin'];

  return {
    dailyCalories: macros.calories,
    proteinGrams: macros.protein,
    carbGrams: macros.carbs,
    fatGrams: macros.fat,
    mealsPerDay: mealTiming.length,
    mealTiming,
    hydrationGoal: profile.waterGoal,
    supplements,
    foodsToAvoid,
    recommendedFoods,
  };
}

function buildWeeklyGoals(profile: UserProfile, weekNumber: number): string[] {
  const base: string[] = [
    `Log all meals for 7 consecutive days`,
    `Complete ${profile.timeAvailablePerDay >= 45 ? 4 : 3} workout sessions`,
    `Hit sleep goal of ${profile.sleepGoal} hours for at least 5 nights`,
    `Drink ${profile.waterGoal} ml of water daily`,
  ];

  if (weekNumber % 4 === 0) {
    base.push('Deload week – reduce volume by 30% and focus on form');
  }

  if (profile.primaryGoal === 'stress-reduction') {
    base.push('Complete 10 minutes of mindfulness or breathing exercises daily');
  }

  return base;
}

function getISODateOffset(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

function deepClonePlan(plan: WellnessPlan): WellnessPlan {
  return JSON.parse(JSON.stringify(plan)) as WellnessPlan;
}
