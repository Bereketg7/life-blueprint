// Calculations code...

export function calculateSum(a: number, b: number): number {
  return a + b;
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string,
): number {
  // Mifflin-St Jeor equation
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,
  'lightly-active': 1.375,
  'moderately-active': 1.55,
  'very-active': 1.725,
  'extra-active': 1.9,
};

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multiplier = activityMultipliers[activityLevel] ?? 1.2;
  return Math.round(bmr * multiplier);
}

const metValues: Record<string, Record<string, number>> = {
  cardio: { low: 5, moderate: 8, high: 12 },
  strength: { low: 3, moderate: 5, high: 7 },
  yoga: { low: 2.5, moderate: 3.5, high: 4 },
  cycling: { low: 6, moderate: 9, high: 14 },
  swimming: { low: 6, moderate: 9, high: 12 },
  walking: { low: 2.8, moderate: 3.5, high: 4.5 },
  running: { low: 7, moderate: 10, high: 14 },
  sports: { low: 5, moderate: 7, high: 10 },
  other: { low: 4, moderate: 6, high: 9 },
};

export function calculateCaloriesBurned(
  activityType: string,
  durationMinutes: number,
  intensity: string,
  weightKg: number = 70,
): number {
  const mets = metValues[activityType] ?? metValues.other;
  const met = mets[intensity] ?? mets.moderate;
  // Calories = MET * weight(kg) * duration(hours)
  return Math.round(met * weightKg * (durationMinutes / 60));
}

export function calculateSleepDuration(bedtime: string, wakeTime: string): number {
  const parseMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + (minutes ?? 0);
  };

  let bedMinutes = parseMinutes(bedtime);
  let wakeMinutes = parseMinutes(wakeTime);

  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60;
  }

  return Math.round(((wakeMinutes - bedMinutes) / 60) * 10) / 10;
}

export function calculateMacroPercentages(
  protein: number,
  carbs: number,
  fat: number,
): { proteinPct: number; carbPct: number; fatPct: number } {
  const proteinCal = protein * 4;
  const carbsCal = carbs * 4;
  const fatCal = fat * 9;
  const total = proteinCal + carbsCal + fatCal;

  if (total === 0) return { proteinPct: 0, carbPct: 0, fatPct: 0 };

  return {
    proteinPct: Math.round((proteinCal / total) * 100),
    carbPct: Math.round((carbsCal / total) * 100),
    fatPct: Math.round((fatCal / total) * 100),
  };
}

export function calculateHydrationGoal(weightKg: number, activityMinutes: number): number {
  // Base: 35ml per kg bodyweight + 500ml per 30 min of activity
  const base = weightKg * 35;
  const activityExtra = Math.floor(activityMinutes / 30) * 500;
  return Math.round(base + activityExtra);
}

export function calculateProgressPercentage(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

// Legacy functions maintained for backward compatibility

export function calculateMacros(
  tdee: number,
  goalType: string,
): { calories: number; protein: number; carbs: number; fat: number } {
  let calories = tdee;
  let proteinPct: number;
  let carbsPct: number;
  let fatPct: number;

  switch (goalType) {
    case 'weight_loss':
      calories = Math.round(tdee * 0.8);
      proteinPct = 0.35;
      carbsPct = 0.35;
      fatPct = 0.3;
      break;
    case 'muscle_gain':
      calories = Math.round(tdee * 1.1);
      proteinPct = 0.3;
      carbsPct = 0.45;
      fatPct = 0.25;
      break;
    case 'endurance':
      proteinPct = 0.2;
      carbsPct = 0.55;
      fatPct = 0.25;
      break;
    case 'flexibility':
    case 'maintenance':
    default:
      proteinPct = 0.25;
      carbsPct = 0.45;
      fatPct = 0.3;
      break;
  }

  return {
    calories,
    protein: Math.round((calories * proteinPct) / 4),
    carbs: Math.round((calories * carbsPct) / 4),
    fat: Math.round((calories * fatPct) / 9),
  };
}

export function calculateIdealWeight(height: number, gender: string): number {
  const heightInches = height / 2.54;
  const inchesOver5Feet = Math.max(0, heightInches - 60);
  if (gender === 'male') {
    return parseFloat((50 + 2.3 * inchesOver5Feet).toFixed(1));
  }
  return parseFloat((45.5 + 2.3 * inchesOver5Feet).toFixed(1));
}

export function calculateBodyFatEstimate(bmi: number, age: number, gender: string): number {
  const sexFactor = gender === 'male' ? 1 : 0;
  const bodyFat = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
  return parseFloat(Math.max(0, bodyFat).toFixed(1));
}
