import {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateCaloriesBurned,
  calculateSleepDuration,
  calculateMacroPercentages,
  calculateHydrationGoal,
  calculateProgressPercentage,
  calculateSum,
} from '../utils/calculations';

describe('calculateSum', () => {
  it('adds two numbers', () => {
    expect(calculateSum(2, 3)).toBe(5);
  });
  it('handles negatives', () => {
    expect(calculateSum(-1, 1)).toBe(0);
  });
});

describe('calculateBMI', () => {
  it('calculates BMI correctly', () => {
    expect(calculateBMI(70, 175)).toBeCloseTo(22.86, 1);
  });
  it('handles edge cases', () => {
    expect(calculateBMI(50, 160)).toBeGreaterThan(0);
  });
});

describe('getBMICategory', () => {
  it('returns Underweight for BMI < 18.5', () => {
    expect(getBMICategory(17)).toBe('Underweight');
  });
  it('returns Normal weight for BMI 18.5-24.9', () => {
    expect(getBMICategory(22)).toBe('Normal weight');
  });
  it('returns Overweight for BMI 25-29.9', () => {
    expect(getBMICategory(27)).toBe('Overweight');
  });
  it('returns Obese for BMI >= 30', () => {
    expect(getBMICategory(32)).toBe('Obese');
  });
});

describe('calculateBMR', () => {
  it('calculates BMR for male', () => {
    const bmr = calculateBMR(70, 175, 30, 'male');
    expect(bmr).toBeGreaterThan(1500);
    expect(bmr).toBeLessThan(2000);
  });
  it('calculates BMR for female', () => {
    const bmr = calculateBMR(60, 165, 25, 'female');
    expect(bmr).toBeGreaterThan(1200);
    expect(bmr).toBeLessThan(1700);
  });
  it('returns a positive number for any gender', () => {
    expect(calculateBMR(70, 170, 30, 'non-binary')).toBeGreaterThan(0);
  });
});

describe('calculateTDEE', () => {
  it('applies sedentary multiplier', () => {
    const bmr = 1700;
    expect(calculateTDEE(bmr, 'sedentary')).toBeCloseTo(bmr * 1.2, 0);
  });
  it('applies very-active multiplier', () => {
    const bmr = 1700;
    const result = calculateTDEE(bmr, 'very-active');
    // Implementation uses Math.round, so allow ±1 difference
    expect(result).toBeGreaterThanOrEqual(Math.floor(bmr * 1.725));
    expect(result).toBeLessThanOrEqual(Math.ceil(bmr * 1.725));
  });
  it('defaults to sedentary (1.2) for unknown level', () => {
    const bmr = 1700;
    expect(calculateTDEE(bmr, 'unknown')).toBeCloseTo(bmr * 1.2, 0);
  });
});

describe('calculateCaloriesBurned', () => {
  it('returns a positive number for walking', () => {
    expect(calculateCaloriesBurned('walking', 30, 'moderate', 70)).toBeGreaterThan(0);
  });
  it('returns more calories for high intensity', () => {
    const low = calculateCaloriesBurned('cardio', 30, 'low', 70);
    const high = calculateCaloriesBurned('cardio', 30, 'high', 70);
    expect(high).toBeGreaterThan(low);
  });
  it('works without weight parameter', () => {
    expect(calculateCaloriesBurned('yoga', 30, 'low')).toBeGreaterThan(0);
  });
});

describe('calculateSleepDuration', () => {
  it('calculates duration for same-day sleep', () => {
    expect(calculateSleepDuration('22:00', '06:00')).toBeCloseTo(8, 0);
  });
  it('handles midnight crossover', () => {
    expect(calculateSleepDuration('23:30', '07:00')).toBeCloseTo(7.5, 0);
  });
  it('returns a positive number', () => {
    expect(calculateSleepDuration('21:00', '05:00')).toBeGreaterThan(0);
  });
});

describe('calculateMacroPercentages', () => {
  it('calculates correct percentages', () => {
    const result = calculateMacroPercentages(150, 200, 65);
    // Each percentage is rounded independently, so sum may differ by a few points
    const sum = result.proteinPct + result.carbPct + result.fatPct;
    expect(sum).toBeGreaterThan(95);
    expect(sum).toBeLessThanOrEqual(100);
  });
  it('handles zero macros', () => {
    const result = calculateMacroPercentages(0, 0, 0);
    expect(result.proteinPct).toBe(0);
  });
});

describe('calculateHydrationGoal', () => {
  it('returns a reasonable hydration goal', () => {
    const goal = calculateHydrationGoal(70, 30);
    expect(goal).toBeGreaterThan(1500);
    expect(goal).toBeLessThan(5000);
  });
});

describe('calculateProgressPercentage', () => {
  it('returns 0 when current is 0', () => {
    expect(calculateProgressPercentage(0, 100)).toBe(0);
  });
  it('returns 100 when at goal', () => {
    expect(calculateProgressPercentage(100, 100)).toBe(100);
  });
  it('caps at 100', () => {
    expect(calculateProgressPercentage(150, 100)).toBe(100);
  });
  it('handles zero goal', () => {
    expect(calculateProgressPercentage(10, 0)).toBe(0);
  });
});
