// Nutritionix API – food database lookup
import { CachedMeal } from '../../types';

const NUTRITIONIX_API_BASE = 'https://trackapi.nutritionix.com/v2';

let _appId = '';
let _appKey = '';

export function setNutritionixCredentials(appId: string, appKey: string): void {
  _appId = appId;
  _appKey = appKey;
}

export interface NutritionixFood {
  food_name: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
  serving_qty: number;
  serving_unit: string;
}

export async function searchFood(query: string): Promise<NutritionixFood[]> {
  if (!_appId || !_appKey) {
    console.warn('[Nutritionix] Credentials not configured');
    return [];
  }

  const response = await fetch(`${NUTRITIONIX_API_BASE}/search/instant?query=${encodeURIComponent(query)}`, {
    headers: {
      'x-app-id': _appId,
      'x-app-key': _appKey,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Nutritionix API error: ${response.status}`);
  }

  const json = await response.json();
  return json.branded ?? json.common ?? [];
}

export async function getNutritionByName(foodName: string): Promise<NutritionixFood | null> {
  const results = await searchFood(foodName);
  return results[0] ?? null;
}

export function nutritionixFoodToCachedMeal(food: NutritionixFood): CachedMeal {
  return {
    id: `meal_${food.food_name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`,
    name: food.food_name,
    calories: Math.round(food.nf_calories),
    protein: Math.round(food.nf_protein),
    carbs: Math.round(food.nf_total_carbohydrate),
    fat: Math.round(food.nf_total_fat),
    frequency: 1,
  };
}
