/**
 * Auto-calculations service.
 *
 * Derives a complete UserProfile from the minimal inputs collected during
 * the 3-step streamlined onboarding.  Uses Mifflin-St Jeor BMR and standard
 * macro-split formulas.
 */

import { UserProfile } from '../types';
import { calculateBMR, calculateTDEE } from '../utils/calculations';

export type ActivityLevelKey = UserProfile['activityLevel'];

interface MinimalInput {
  name: string;
  height: number;       // cm
  weight: number;       // kg
  activityLevel: ActivityLevelKey;
  primaryGoals: string[];
}

/**
 * Derive a full UserProfile from minimal onboarding inputs.
 *
 * Defaults applied automatically:
 * - age: 30 (can be updated in Profile screen later)
 * - gender: 'male' (can be changed in Profile screen later)
 * - healthConditions / dietaryRestrictions: [] (ask later if needed)
 * - notification preferences: all enabled
 */
export function autoCalculateProfile(
  input: MinimalInput,
  userId: string,
): UserProfile {
  const { name, height, weight, activityLevel, primaryGoals } = input;

  // Sensible defaults for optional fields
  const age = 30;
  const gender: UserProfile['gender'] = 'male';

  // Energy calculations
  const bmr = calculateBMR(weight, height, age, gender);
  let tdee = calculateTDEE(bmr, activityLevel);

  // Goal-based caloric adjustment
  if (primaryGoals.includes('weight-loss') || primaryGoals.includes('Lose Weight')) {
    tdee = Math.round(tdee * 0.85); // 15% deficit
  } else if (primaryGoals.includes('muscle-gain') || primaryGoals.includes('Build Muscle')) {
    tdee = Math.round(tdee * 1.1); // 10% surplus
  }

  // Macro targets
  const isMuscleGoal =
    primaryGoals.includes('muscle-gain') || primaryGoals.includes('Build Muscle');
  const proteinPerKg = isMuscleGoal ? 2.2 : 1.8;
  const protein = Math.round(weight * proteinPerKg);
  const fat = Math.round((tdee * 0.25) / 9);
  const carbs = Math.round((tdee - protein * 4 - fat * 9) / 4);

  const now = new Date().toISOString();

  return {
    id: `profile_${Date.now()}`,
    userId,
    age,
    gender,
    height,
    weight,
    activityLevel,
    primaryGoal: (primaryGoals[0] as UserProfile['primaryGoal']) ?? 'general-wellness',
    primaryGoals,
    secondaryGoals: [],
    healthConditions: [],
    dietaryRestrictions: [],
    fitnessLevel: 'beginner',
    timeAvailablePerDay: 30,
    sleepGoal: 8,
    waterGoal: Math.round(weight * 35), // 35 ml / kg bodyweight
    calorieGoal: tdee,
    proteinGoal: protein,
    carbGoal: Math.max(carbs, 50), // minimum 50 g/day to meet essential carbohydrate intake needs
    fatGoal: fat,
    createdAt: now,
    updatedAt: now,
    // Store display name for greeting etc.
    ...(name ? { name } : {}),
  } as UserProfile & { name?: string };
}

/** Labels shown in the Step 3 confirmation screen. */
export function getActivityLevelLabel(level: ActivityLevelKey): string {
  const labels: Record<ActivityLevelKey, string> = {
    sedentary: 'Sedentary (desk job / little exercise)',
    'lightly-active': 'Lightly Active (light exercise 1-3×/wk)',
    'moderately-active': 'Moderately Active (exercise 3-5×/wk)',
    'very-active': 'Very Active (hard exercise 6-7×/wk)',
    'extra-active': 'Extra Active (physical job + daily training)',
  };
  return labels[level] ?? level;
}
