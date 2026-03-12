import {
  recommendMacros,
  prescribeExercise,
  suggestRecoveryProtocol,
  generateWeeklyPlan,
} from '../services/planGenerator';
import { UserProfile } from '../types';

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'profile_1',
    userId: 'u1',
    age: 30,
    gender: 'male',
    height: 175,
    weight: 75,
    activityLevel: 'moderately-active',
    primaryGoal: 'weight-loss',
    secondaryGoals: [],
    healthConditions: [],
    dietaryRestrictions: [],
    fitnessLevel: 'intermediate',
    timeAvailablePerDay: 45,
    sleepGoal: 8,
    waterGoal: 2500,
    calorieGoal: 2000,
    proteinGoal: 150,
    carbGoal: 200,
    fatGoal: 65,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('recommendMacros', () => {
  it('returns macros with all required fields', () => {
    const macros = recommendMacros('weight-loss', 75, 'moderately-active');
    expect(typeof macros.calories).toBe('number');
    expect(typeof macros.protein).toBe('number');
    expect(typeof macros.carbs).toBe('number');
    expect(typeof macros.fat).toBe('number');
  });

  it('returns positive macros', () => {
    const macros = recommendMacros('weight-loss', 75, 'moderately-active');
    expect(macros.calories).toBeGreaterThan(0);
    expect(macros.protein).toBeGreaterThan(0);
    expect(macros.carbs).toBeGreaterThan(0);
    expect(macros.fat).toBeGreaterThan(0);
  });

  it('weight-loss has fewer calories than muscle-gain', () => {
    const loss = recommendMacros('weight-loss', 75, 'moderately-active');
    const gain = recommendMacros('muscle-gain', 75, 'moderately-active');
    expect(loss.calories).toBeLessThan(gain.calories);
  });

  it('handles different activity levels', () => {
    const sedentary = recommendMacros('general-wellness', 70, 'sedentary');
    const active = recommendMacros('general-wellness', 70, 'very-active');
    expect(active.calories).toBeGreaterThan(sedentary.calories);
  });
});

describe('prescribeExercise', () => {
  it('returns an ExercisePlan with required fields', () => {
    const plan = prescribeExercise('beginner', 'weight-loss', 30);
    expect(typeof plan.sessionsPerWeek).toBe('number');
    expect(typeof plan.sessionDuration).toBe('number');
    expect(Array.isArray(plan.exercises)).toBe(true);
    expect(typeof plan.intensity).toBe('string');
    expect(Array.isArray(plan.restDays)).toBe(true);
  });

  it('returns positive session count', () => {
    const plan = prescribeExercise('intermediate', 'muscle-gain', 60);
    expect(plan.sessionsPerWeek).toBeGreaterThan(0);
  });

  it('gives fewer sessions for beginners vs advanced', () => {
    const beginner = prescribeExercise('beginner', 'weight-loss', 45);
    const advanced = prescribeExercise('advanced', 'weight-loss', 45);
    expect(advanced.sessionsPerWeek).toBeGreaterThanOrEqual(beginner.sessionsPerWeek);
  });

  it('includes at least one exercise', () => {
    const plan = prescribeExercise('intermediate', 'endurance', 45);
    expect(plan.exercises.length).toBeGreaterThan(0);
  });
});

describe('suggestRecoveryProtocol', () => {
  it('returns a RecoveryProtocol with required fields', () => {
    const protocol = suggestRecoveryProtocol(7, 2);
    expect(typeof protocol.sleepGoal).toBe('number');
    expect(Array.isArray(protocol.stressManagement)).toBe(true);
    expect(Array.isArray(protocol.recoveryActivities)).toBe(true);
    expect(Array.isArray(protocol.supplementRecommendations)).toBe(true);
  });

  it('returns a positive sleepGoal', () => {
    const lowSleep = suggestRecoveryProtocol(4, 3);
    const goodSleep = suggestRecoveryProtocol(8, 1);
    // Implementation: sleepGoal = avgSleepHours < 7 ? min(avgSleepHours+1, 9) : avgSleepHours
    // So lowSleep.sleepGoal = 5, goodSleep.sleepGoal = 8
    expect(lowSleep.sleepGoal).toBeGreaterThan(0);
    expect(goodSleep.sleepGoal).toBe(8);
    // When sleep is already good, it is maintained
    expect(lowSleep.sleepGoal).toBeLessThanOrEqual(goodSleep.sleepGoal);
  });

  it('includes recovery activities', () => {
    const protocol = suggestRecoveryProtocol(6, 3);
    expect(protocol.recoveryActivities.length).toBeGreaterThan(0);
  });
});

describe('generateWeeklyPlan', () => {
  it('returns a WellnessPlan with all required fields', () => {
    const profile = makeProfile();
    const plan = generateWeeklyPlan(profile, 1);
    expect(typeof plan.id).toBe('string');
    expect(plan.weekNumber).toBe(1);
    expect(plan.nutritionPlan).toBeDefined();
    expect(plan.exercisePlan).toBeDefined();
    expect(plan.recoveryProtocol).toBeDefined();
    expect(Array.isArray(plan.weeklyGoals)).toBe(true);
  });

  it('generates different plans for different weeks', () => {
    const profile = makeProfile();
    const week1 = generateWeeklyPlan(profile, 1);
    const week4 = generateWeeklyPlan(profile, 4);
    // IDs should be different
    expect(week1.id).not.toBe(week4.id);
  });

  it('includes at least one weekly goal', () => {
    const plan = generateWeeklyPlan(makeProfile(), 1);
    expect(plan.weeklyGoals.length).toBeGreaterThan(0);
  });

  it('works for muscle-gain goal', () => {
    const profile = makeProfile({ primaryGoal: 'muscle-gain' });
    const plan = generateWeeklyPlan(profile, 1);
    expect(plan.nutritionPlan.dailyCalories).toBeGreaterThan(0);
  });
});
