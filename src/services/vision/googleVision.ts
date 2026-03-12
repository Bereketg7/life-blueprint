import { FoodDetectionResult, PortionEstimate, VisionAnalysisResult } from '../../types';

export const GOOGLE_VISION_API_URL =
  'https://vision.googleapis.com/v1/images:annotate';

export const CONFIDENCE_THRESHOLDS = {
  highConfidence: 0.85,
  mediumConfidence: 0.65,
  lowConfidence: 0.4,
};

// ─── Food label patterns ───────────────────────────────────────────────────────

const FOOD_LABELS = new Set([
  'food', 'dish', 'meal', 'cuisine', 'ingredient', 'breakfast', 'lunch', 'dinner',
  'snack', 'dessert', 'salad', 'soup', 'pizza', 'burger', 'sandwich', 'pasta',
  'rice', 'sushi', 'steak', 'chicken', 'fish', 'fruit', 'vegetable', 'cake',
]);

function isFoodLabel(label: string): boolean {
  const lower = label.toLowerCase();
  return FOOD_LABELS.has(lower) || lower.includes('food') || lower.includes('eat');
}

// ─── API calls ─────────────────────────────────────────────────────────────────

/**
 * Calls the Google Vision API with a base64-encoded image.
 * In production, provide a real API key via environment config.
 */
export async function analyzeImage(
  imageBase64: string,
  apiKey?: string
): Promise<VisionAnalysisResult> {
  if (!imageBase64) throw new Error('imageBase64 is required');

  if (apiKey) {
    const response = await fetch(`${GOOGLE_VISION_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageBase64 },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 20 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
              { type: 'SAFE_SEARCH_DETECTION' },
            ],
          },
        ],
      }),
    });
    if (!response.ok) throw new Error(`Vision API error: ${response.status}`);
    const json = await response.json();
    const result = json.responses?.[0] ?? {};
    return {
      labels: (result.labelAnnotations ?? []).map(
        (l: { description: string; score: number }) => ({
          description: l.description,
          score: l.score,
        })
      ),
      objects: (result.localizedObjectAnnotations ?? []).map(
        (o: { name: string; score: number }) => ({ name: o.name, score: o.score })
      ),
      safeSearch: result.safeSearchAnnotation ?? {},
      raw: result,
    };
  }

  // Mock response when no API key
  return {
    labels: [
      { description: 'Food', score: 0.97 },
      { description: 'Dish', score: 0.94 },
      { description: 'Salad', score: 0.88 },
      { description: 'Vegetable', score: 0.82 },
    ],
    objects: [
      { name: 'Salad', score: 0.91 },
      { name: 'Bowl', score: 0.85 },
    ],
    safeSearch: { adult: 'VERY_UNLIKELY', violence: 'VERY_UNLIKELY' },
    raw: {},
  };
}

export async function detectFoodItems(
  imageBase64: string,
  apiKey?: string
): Promise<FoodDetectionResult[]> {
  const analysis = await analyzeImage(imageBase64, apiKey);
  return analysis.labels
    .filter((l) => l.score >= CONFIDENCE_THRESHOLDS.lowConfidence && isFoodLabel(l.description))
    .map((l) => ({
      name: l.description,
      confidence: l.score,
    }));
}

export async function estimatePortionSize(
  _imageBase64: string,
  foodItem: string
): Promise<PortionEstimate> {
  // In production, combine object detection bounding-box area with reference objects
  // to estimate portion size. Here we return a sensible mock.
  return {
    foodItem,
    portionSize: 'medium',
    estimatedGrams: 200,
    confidence: 0.7,
  };
}
