// Body composition – muscle mass and body fat estimation
import { Biomarker, UserProfile } from '../../types';
import { createBiomarker } from './biomarkerCalculations';

// US Navy body fat formula
export function estimateBodyFatNavy(
  gender: 'male' | 'female' | 'other',
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm?: number // required for female
): number {
  if (gender === 'male') {
    const bodyFat =
      86.01 * Math.log10(waistCm - neckCm) - 70.041 * Math.log10(heightCm) + 36.76;
    return Math.max(3, Math.round(bodyFat * 10) / 10);
  }
  if (!hipCm) return 0;
  const bodyFat =
    163.205 * Math.log10(waistCm + hipCm - neckCm) -
    97.684 * Math.log10(heightCm) -
    78.387;
  return Math.max(8, Math.round(bodyFat * 10) / 10);
}

// BMI-based rough estimate
export function estimateBodyFatFromBMI(
  bmi: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): number {
  const sexFactor = gender === 'male' ? 1 : 0;
  const bodyFat = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
  return Math.max(3, Math.round(bodyFat * 10) / 10);
}

export function calcBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function estimateMuscleMass(
  weightKg: number,
  bodyFatPercent: number
): number {
  return Math.round(weightKg * (1 - bodyFatPercent / 100) * 10) / 10;
}

export function logBodyFat(userId: string, bodyFatPercent: number): Biomarker {
  return createBiomarker(userId, 'body_fat', bodyFatPercent);
}

export function logMuscleMass(userId: string, muscleMassKg: number): Biomarker {
  return createBiomarker(userId, 'muscle_mass', muscleMassKg);
}
