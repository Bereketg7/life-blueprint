import { recognizeMealFromPhoto } from '../services/mealRecognition';
import { MEAL_PRESETS } from '../services/mealPresets';

jest.useFakeTimers();

describe('mealRecognition', () => {
  test('resolves with a meal and confidence score', async () => {
    const promise = recognizeMealFromPhoto('test://photo.jpg');
    jest.runAllTimers();
    const result = await promise;

    expect(result).toHaveProperty('meal');
    expect(result).toHaveProperty('confidence');
  });

  test('returned meal exists in the MEAL_PRESETS list', async () => {
    const promise = recognizeMealFromPhoto('test://photo.jpg');
    jest.runAllTimers();
    const result = await promise;

    const names = MEAL_PRESETS.map((p) => p.name);
    expect(names).toContain(result.meal.name);
  });

  test('confidence is between 0 and 1', async () => {
    const promise = recognizeMealFromPhoto('test://photo.jpg');
    jest.runAllTimers();
    const result = await promise;

    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});
