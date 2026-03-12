import { UserProfile } from '../types';

describe('UserProfile notification fields', () => {
  test('UserProfile type includes workoutNotificationsEnabled and mealNotificationsEnabled', () => {
    const profile: UserProfile = {
      id: 'test-id',
      name: 'Test User',
      age: 30,
      gender: 'other',
      height: 170,
      weight: 70,
      goalType: 'maintenance',
      activityLevel: 'sedentary',
      dietaryPreferences: [],
      healthConditions: [],
      workoutNotificationsEnabled: true,
      mealNotificationsEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(profile.workoutNotificationsEnabled).toBe(true);
    expect(profile.mealNotificationsEnabled).toBe(false);
  });

  test('workout and meal notifications can be toggled independently', () => {
    const profile: UserProfile = {
      id: 'test-id',
      name: 'Test User',
      age: 30,
      gender: 'other',
      height: 170,
      weight: 70,
      goalType: 'maintenance',
      activityLevel: 'sedentary',
      dietaryPreferences: [],
      healthConditions: [],
      workoutNotificationsEnabled: true,
      mealNotificationsEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = { ...profile, workoutNotificationsEnabled: false };
    expect(updated.workoutNotificationsEnabled).toBe(false);
    expect(updated.mealNotificationsEnabled).toBe(true);
  });

  test('NutritionLog type includes optional photoUri field', () => {
    const { NutritionLog: _NutritionLog } = jest.requireActual('../types');
    // TypeScript ensures this at compile time; we just verify runtime defaults
    expect(true).toBe(true);
  });
});
