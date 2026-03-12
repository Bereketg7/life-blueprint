import { UserProfile } from '../types';

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateAge(age: number): boolean {
  return Number.isFinite(age) && age >= 13 && age <= 120;
}

export function validateWeight(kg: number): boolean {
  return Number.isFinite(kg) && kg >= 20 && kg <= 500;
}

export function validateHeight(cm: number): boolean {
  return Number.isFinite(cm) && cm >= 50 && cm <= 300;
}

export function validateCalories(calories: number): boolean {
  return Number.isFinite(calories) && calories >= 0 && calories <= 5000;
}

export function validateDuration(minutes: number): boolean {
  return Number.isFinite(minutes) && minutes >= 1 && minutes <= 600;
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateUserProfile(profile: Partial<UserProfile>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (profile.age !== undefined && !validateAge(profile.age)) {
    errors.push('Age must be between 13 and 120.');
  }

  if (profile.weight !== undefined && !validateWeight(profile.weight)) {
    errors.push('Weight must be between 20 and 500 kg.');
  }

  if (profile.height !== undefined && !validateHeight(profile.height)) {
    errors.push('Height must be between 50 and 300 cm.');
  }

  if (profile.calorieGoal !== undefined && !validateCalories(profile.calorieGoal)) {
    errors.push('Calorie goal must be between 0 and 5000 kcal.');
  }

  if (profile.timeAvailablePerDay !== undefined && !validateDuration(profile.timeAvailablePerDay)) {
    errors.push('Time available per day must be between 1 and 600 minutes.');
  }

  if (profile.sleepGoal !== undefined) {
    if (!Number.isFinite(profile.sleepGoal) || profile.sleepGoal < 1 || profile.sleepGoal > 14) {
      errors.push('Sleep goal must be between 1 and 14 hours.');
    }
  }

  return { valid: errors.length === 0, errors };
}
