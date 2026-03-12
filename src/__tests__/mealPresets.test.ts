import { MEAL_PRESETS, MealPreset } from '../services/mealPresets';

describe('mealPresets', () => {
  test('MEAL_PRESETS is a non-empty array', () => {
    expect(Array.isArray(MEAL_PRESETS)).toBe(true);
    expect(MEAL_PRESETS.length).toBeGreaterThan(0);
  });

  test('each preset has the required fields', () => {
    MEAL_PRESETS.forEach((preset: MealPreset) => {
      expect(typeof preset.name).toBe('string');
      expect(preset.name.length).toBeGreaterThan(0);
      expect(typeof preset.calories).toBe('number');
      expect(typeof preset.protein).toBe('number');
      expect(typeof preset.carbs).toBe('number');
      expect(typeof preset.fat).toBe('number');
    });
  });

  test('all nutritional values are non-negative', () => {
    MEAL_PRESETS.forEach((preset: MealPreset) => {
      expect(preset.calories).toBeGreaterThanOrEqual(0);
      expect(preset.protein).toBeGreaterThanOrEqual(0);
      expect(preset.carbs).toBeGreaterThanOrEqual(0);
      expect(preset.fat).toBeGreaterThanOrEqual(0);
    });
  });

  test('preset names are unique', () => {
    const names = MEAL_PRESETS.map((p) => p.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });
});
