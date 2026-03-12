// Barcode / QR code scanning for food products
import { MealRecognitionResult } from '../../types';

export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

const OPENFOODFACTS_API = 'https://world.openfoodfacts.org/api/v0/product';

export async function lookupBarcode(barcode: string): Promise<BarcodeProduct | null> {
  try {
    const response = await fetch(`${OPENFOODFACTS_API}/${barcode}.json`);
    if (!response.ok) return null;

    const json = await response.json();
    if (!json.product) return null;

    const p = json.product;
    return {
      barcode,
      name: p.product_name ?? 'Unknown',
      brand: p.brands ?? '',
      calories: Number(p.nutriments?.['energy-kcal_100g'] ?? 0),
      protein: Number(p.nutriments?.proteins_100g ?? 0),
      carbs: Number(p.nutriments?.carbohydrates_100g ?? 0),
      fat: Number(p.nutriments?.fat_100g ?? 0),
      servingSize: p.serving_size ?? '100g',
    };
  } catch {
    return null;
  }
}

export function barcodeProductToMealResult(product: BarcodeProduct): MealRecognitionResult {
  return {
    mealName: `${product.brand} ${product.name}`.trim(),
    confidence: 100,
    suggestedMacros: {
      calories: product.calories,
      protein: product.protein,
      carbs: product.carbs,
      fat: product.fat,
    },
    portions: [`1 ${product.servingSize}`, `2 ${product.servingSize}`],
    source: 'barcode',
  };
}
