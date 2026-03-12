import { MealPreset, MEAL_PRESETS } from './mealPresets';

export interface RecognitionResult {
  meal: MealPreset;
  confidence: number;
}

/**
 * Mock AI meal recognition service.
 * In production, replace with a real vision API (e.g. Google Vision, Clarifai).
 * Simulates a network delay and returns a plausible meal match.
 */
export async function recognizeMealFromPhoto(_photoUri: string): Promise<RecognitionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const index = Math.floor(Math.random() * MEAL_PRESETS.length);
  const confidence = 0.7 + Math.random() * 0.25;

  return {
    meal: MEAL_PRESETS[index],
    confidence: parseFloat(confidence.toFixed(2)),
  };
}
