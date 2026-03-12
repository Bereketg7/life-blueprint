import { NutritionData, NutritionixFood } from '../../types';

export const NUTRITIONIX_API_BASE = 'https://trackapi.nutritionix.com/v2';

// ─── Mock food database ────────────────────────────────────────────────────────

const MOCK_FOODS: NutritionixFood[] = [
  {
    id: 'nix_chicken_breast',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    servingSize: 100,
    servingUnit: 'g',
  },
  {
    id: 'nix_brown_rice',
    name: 'Brown Rice (cooked)',
    calories: 216,
    protein: 5,
    carbs: 44,
    fat: 1.8,
    fiber: 3.5,
    sugar: 0.7,
    sodium: 10,
    servingSize: 1,
    servingUnit: 'cup',
  },
  {
    id: 'nix_broccoli',
    name: 'Broccoli',
    calories: 55,
    protein: 3.7,
    carbs: 11,
    fat: 0.6,
    fiber: 5.1,
    sugar: 2.6,
    sodium: 64,
    servingSize: 1,
    servingUnit: 'cup',
  },
  {
    id: 'nix_salmon',
    name: 'Salmon (Atlantic)',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    servingSize: 100,
    servingUnit: 'g',
  },
  {
    id: 'nix_oatmeal',
    name: 'Oatmeal',
    calories: 158,
    protein: 5.5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    sugar: 0.5,
    sodium: 9,
    servingSize: 1,
    servingUnit: 'cup cooked',
  },
];

// ─── API helpers ───────────────────────────────────────────────────────────────

async function callNutritionix<T>(
  endpoint: string,
  body: Record<string, unknown>,
  appId?: string,
  appKey?: string
): Promise<T> {
  if (appId && appKey) {
    const response = await fetch(`${NUTRITIONIX_API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': appId,
        'x-app-key': appKey,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Nutritionix API error: ${response.status}`);
    return response.json() as Promise<T>;
  }
  throw new Error('mock');
}

// ─── Public API ────────────────────────────────────────────────────────────────

export async function searchFood(
  query: string,
  appId?: string,
  appKey?: string
): Promise<NutritionixFood[]> {
  if (!query.trim()) return [];

  try {
    const data = await callNutritionix<{ common: Array<{ food_name: string; photo: { thumb: string } }> }>(
      '/search/instant',
      { query },
      appId,
      appKey
    );
    return (data.common ?? []).slice(0, 10).map((item, i) => ({
      id: `nix_search_${i}`,
      name: item.food_name,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      servingSize: 1,
      servingUnit: 'serving',
      imageUrl: item.photo?.thumb,
    }));
  } catch {
    // Fall back to local mock search
    const lower = query.toLowerCase();
    return MOCK_FOODS.filter((f) => f.name.toLowerCase().includes(lower));
  }
}

export async function getFoodByBarcode(
  barcode: string,
  appId?: string,
  appKey?: string
): Promise<NutritionixFood> {
  try {
    const data = await callNutritionix<{ food: NutritionixFood }>(
      '/search/item',
      { upc: barcode },
      appId,
      appKey
    );
    return data.food;
  } catch {
    // Mock barcode lookup
    return {
      id: `barcode_${barcode}`,
      name: 'Product (scanned)',
      barcode,
      calories: 120,
      protein: 3,
      carbs: 18,
      fat: 4,
      servingSize: 1,
      servingUnit: 'serving',
    };
  }
}

export async function getNutritionByName(
  foodName: string,
  quantity: number = 1,
  unit: string = 'serving',
  appId?: string,
  appKey?: string
): Promise<NutritionData> {
  try {
    const data = await callNutritionix<{
      foods: Array<{
        nf_calories: number;
        nf_protein: number;
        nf_total_carbohydrate: number;
        nf_total_fat: number;
        nf_dietary_fiber: number;
        nf_sugars: number;
        nf_sodium: number;
        serving_weight_grams: number;
        serving_unit: string;
      }>;
    }>(
      '/natural/nutrients',
      { query: `${quantity} ${unit} ${foodName}` },
      appId,
      appKey
    );
    const food = data.foods?.[0];
    if (!food) throw new Error('No nutrition data');
    return {
      calories: food.nf_calories,
      protein: food.nf_protein,
      carbs: food.nf_total_carbohydrate,
      fat: food.nf_total_fat,
      fiber: food.nf_dietary_fiber,
      sugar: food.nf_sugars,
      sodium: food.nf_sodium,
      servingSize: String(food.serving_weight_grams),
      servingUnit: food.serving_unit,
    };
  } catch {
    const match = MOCK_FOODS.find((f) => f.name.toLowerCase().includes(foodName.toLowerCase()));
    if (match) {
      return {
        calories: Math.round(match.calories * quantity),
        protein: Math.round(match.protein * quantity * 10) / 10,
        carbs: Math.round(match.carbs * quantity * 10) / 10,
        fat: Math.round(match.fat * quantity * 10) / 10,
        fiber: match.fiber ? Math.round(match.fiber * quantity * 10) / 10 : undefined,
        sugar: match.sugar ? Math.round(match.sugar * quantity * 10) / 10 : undefined,
        sodium: match.sodium ? Math.round(match.sodium * quantity) : undefined,
        servingSize: String(match.servingSize * quantity),
        servingUnit: match.servingUnit,
      };
    }
    // Generic fallback
    return {
      calories: 150 * quantity,
      protein: 5 * quantity,
      carbs: 20 * quantity,
      fat: 5 * quantity,
      servingSize: String(quantity),
      servingUnit: unit,
    };
  }
}
