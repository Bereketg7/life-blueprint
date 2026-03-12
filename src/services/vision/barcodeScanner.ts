import { BarcodeResult, NutritionixFood } from '../../types';
import { getFoodByBarcode } from './nutritionixApi';

// ─── Barcode Scanner ───────────────────────────────────────────────────────────

/**
 * Scans a barcode from an image URI.
 * In production, use expo-barcode-scanner or expo-camera to decode barcodes
 * from live camera feed. This stub simulates a scan result.
 */
export async function scanBarcode(imageUri: string): Promise<BarcodeResult> {
  if (!imageUri) throw new Error('imageUri is required');

  // Simulate scan latency
  await new Promise((res) => setTimeout(res, 300));

  // In production, pass the image to a barcode decoding library (e.g., zxing-wasm)
  // and return the actual barcode data. Here we return a mock.
  return {
    barcode: '012345678905',
    format: 'EAN_13',
    rawValue: '012345678905',
  };
}

/**
 * Look up product nutrition data for a scanned barcode.
 * Returns null when the barcode cannot be found in the database.
 */
export async function lookupBarcode(
  barcode: string,
  appId?: string,
  appKey?: string
): Promise<NutritionixFood | null> {
  if (!barcode) return null;
  try {
    return await getFoodByBarcode(barcode, appId, appKey);
  } catch {
    return null;
  }
}
