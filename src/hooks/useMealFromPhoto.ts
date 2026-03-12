import { useState, useCallback } from 'react';
import { MealRecognitionResult } from '../types';
import { analyzeImage, labelsToMealResult } from '../services/vision/googleVision';
import { getNutritionByName, nutritionixFoodToCachedMeal } from '../services/vision/nutritionixApi';
import { cacheMeal } from '../services/vision/mealCache';

export function useMealFromPhoto() {
  const [result, setResult] = useState<MealRecognitionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recogniseMeal = useCallback(async (base64Image: string) => {
    setLoading(true);
    setError(null);
    try {
      const labels = await analyzeImage(base64Image);

      if (labels.length === 0) {
        const fallback: MealRecognitionResult = {
          mealName: 'Unknown food',
          confidence: 0,
          suggestedMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          portions: ['1 serving'],
          source: 'vision_api',
        };
        setResult(fallback);
        return fallback;
      }

      const topLabel = labels[0].description;
      const nutrition = await getNutritionByName(topLabel);

      const macros = nutrition
        ? {
            calories: Math.round(nutrition.nf_calories),
            protein: Math.round(nutrition.nf_protein),
            carbs: Math.round(nutrition.nf_total_carbohydrate),
            fat: Math.round(nutrition.nf_total_fat),
          }
        : { calories: 0, protein: 0, carbs: 0, fat: 0 };

      const mealResult = labelsToMealResult(labels, macros);
      setResult(mealResult);

      if (nutrition) {
        cacheMeal(nutritionixFoodToCachedMeal(nutrition));
      }

      return mealResult;
    } catch (err: any) {
      setError(err?.message ?? 'Recognition failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, recogniseMeal, reset };
}
