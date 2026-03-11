import { UserProfile } from '../types';

export function validateAge(age: number): { valid: boolean; error?: string } {
  if (!Number.isFinite(age) || age < 1) return { valid: false, error: 'Age must be at least 1.' };
  if (age > 120) return { valid: false, error: 'Age must be 120 or less.' };
  return { valid: true };
}

export function validateWeight(weight: number): { valid: boolean; error?: string } {
  if (!Number.isFinite(weight) || weight <= 0) return { valid: false, error: 'Weight must be greater than 0.' };
  if (weight < 20) return { valid: false, error: 'Weight must be at least 20 kg.' };
  if (weight > 500) return { valid: false, error: 'Weight must be 500 kg or less.' };
  return { valid: true };
}

export function validateHeight(height: number): { valid: boolean; error?: string } {
  if (!Number.isFinite(height) || height <= 0) return { valid: false, error: 'Height must be greater than 0.' };
  if (height < 50) return { valid: false, error: 'Height must be at least 50 cm.' };
  if (height > 300) return { valid: false, error: 'Height must be 300 cm or less.' };
  return { valid: true };
}

export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) return { valid: false, error: 'Name is required.' };
  if (name.trim().length < 2) return { valid: false, error: 'Name must be at least 2 characters.' };
  if (name.trim().length > 100) return { valid: false, error: 'Name must be 100 characters or less.' };
  return { valid: true };
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) return { valid: false, error: 'Email is required.' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return { valid: false, error: 'Please enter a valid email address.' };
  return { valid: true };
}

export function validateProfile(profile: Partial<UserProfile>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (profile.name !== undefined) {
    const nameResult = validateName(profile.name);
    if (!nameResult.valid && nameResult.error) errors.push(nameResult.error);
  }

  if (profile.age !== undefined) {
    const ageResult = validateAge(profile.age);
    if (!ageResult.valid && ageResult.error) errors.push(ageResult.error);
  }

  if (profile.weight !== undefined) {
    const weightResult = validateWeight(profile.weight);
    if (!weightResult.valid && weightResult.error) errors.push(weightResult.error);
  }

  if (profile.height !== undefined) {
    const heightResult = validateHeight(profile.height);
    if (!heightResult.valid && heightResult.error) errors.push(heightResult.error);
  }

  return { valid: errors.length === 0, errors };
}
