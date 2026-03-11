const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

/**
 * Calculate Body Mass Index.
 * @param weight - kilograms
 * @param height - centimeters
 */
export function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

/**
 * Calculate Total Daily Energy Expenditure using the Mifflin-St Jeor equation.
 * For gender values other than 'male', the female formula is applied.
 * @param weight - kilograms
 * @param height - centimeters
 * @param age    - years
 * @param gender - 'male' | 'female' | 'other' (non-male uses female formula)
 * @param activityLevel - one of the ACTIVITY_MULTIPLIERS keys
 */
export function calculateTDEE(
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
): number {
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate daily macro targets based on TDEE and goal type.
 * Returns calories and grams of protein, carbs, and fat.
 */
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

/**
 * Estimate ideal body weight using the Devine formula.
 * @param height - centimeters
 * @param gender - 'male' | 'female' | other string
 */
export function calculateIdealWeight(height: number, gender: string): number {
  const heightInches = height / 2.54;
  const inchesOver5Feet = Math.max(0, heightInches - 60);
  if (gender === 'male') {
    return parseFloat((50 + 2.3 * inchesOver5Feet).toFixed(1));
  }
  return parseFloat((45.5 + 2.3 * inchesOver5Feet).toFixed(1));
}

/**
 * Estimate body fat percentage using the Deurenberg formula.
 * For gender values other than 'male', sexFactor=0 (female formula) is applied.
 * @param bmi    - Body Mass Index
 * @param age    - years
 * @param gender - 'male' | 'female' | 'other' (non-male uses female formula)
 */
export function calculateBodyFatEstimate(bmi: number, age: number, gender: string): number {
  const sexFactor = gender === 'male' ? 1 : 0;
  const bodyFat = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
  return parseFloat(Math.max(0, bodyFat).toFixed(1));
}

