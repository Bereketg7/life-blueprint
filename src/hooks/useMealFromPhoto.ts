import { useState, useCallback } from 'react';
import { MealPhoto, MealRecognitionResult } from '../types';
import { detectFoodItems, estimatePortionSize } from '../services/vision/googleVision';
import { getNutritionByName } from '../services/vision/nutritionixApi';
import { cacheMeal } from '../services/vision/mealCache';

interface UseMealFromPhotoReturn {
  analyzePhoto: (photo: MealPhoto) => Promise<void>;
  confirmMeal: (result: MealRecognitionResult) => Promise<void>;
  isAnalyzing: boolean;
  result: MealRecognitionResult | null;
  error: string | null;
  reset: () => void;
}

export function useMealFromPhoto(): UseMealFromPhotoReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MealRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzePhoto = useCallback(async (photo: MealPhoto) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const base64 = photo.base64 ?? '';
      const foodItems = await detectFoodItems(base64);

      if (foodItems.length === 0) {
        setError('No food items detected. Try a clearer photo.');
        return;
      }

      // Fetch nutrition for each detected food item in parallel
      const enriched = await Promise.all(
        foodItems.slice(0, 5).map(async (item) => {
          const portionEstimate = await estimatePortionSize(base64, item.name);
          const nutrition = await getNutritionByName(item.name, 1, 'serving');

          const portionMultipliers = {
            small: 0.6,
            medium: 1.0,
            large: 1.4,
            extra_large: 1.8,
          };
          const mult = portionMultipliers[portionEstimate.portionSize];

          return {
            name: item.name,
            confidence: item.confidence,
            portionSize: portionEstimate.portionSize as MealRecognitionResult['foodItems'][0]['portionSize'],
            calories: Math.round(nutrition.calories * mult),
            protein: Math.round(nutrition.protein * mult * 10) / 10,
            carbs: Math.round(nutrition.carbs * mult * 10) / 10,
            fat: Math.round(nutrition.fat * mult * 10) / 10,
          };
        })
      );

      const totals = enriched.reduce(
        (acc, item) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      const recognitionResult: MealRecognitionResult = {
        id: `meal_${Date.now()}`,
        foodItems: enriched,
        totalCalories: totals.calories,
        totalProtein: Math.round(totals.protein * 10) / 10,
        totalCarbs: Math.round(totals.carbs * 10) / 10,
        totalFat: Math.round(totals.fat * 10) / 10,
        overallConfidence:
          enriched.reduce((sum, i) => sum + i.confidence, 0) / enriched.length,
        photoUri: photo.uri,
        analyzedAt: new Date().toISOString(),
      };

      setResult(recognitionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const confirmMeal = useCallback(async (confirmedResult: MealRecognitionResult) => {
    const mealName = confirmedResult.foodItems.map((i) => i.name).join(', ');

    await cacheMeal({
      id: confirmedResult.id,
      name: mealName,
      calories: confirmedResult.totalCalories,
      protein: confirmedResult.totalProtein,
      carbs: confirmedResult.totalCarbs,
      fat: confirmedResult.totalFat,
      imageUri: confirmedResult.photoUri,
      frequency: 1,
      lastUsedAt: new Date().toISOString(),
      source: 'photo',
    });

    setResult(null);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return { analyzePhoto, confirmMeal, isAnalyzing, result, error, reset };
}
