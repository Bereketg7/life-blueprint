// Google Cloud Vision API for image recognition
import { MealRecognitionResult } from '../../types';

const VISION_API_BASE = 'https://vision.googleapis.com/v1/images:annotate';

export interface VisionLabel {
  description: string;
  score: number;
}

let _apiKey = '';

export function setGoogleVisionApiKey(key: string): void {
  _apiKey = key;
}

export async function analyzeImage(base64Image: string): Promise<VisionLabel[]> {
  if (!_apiKey) {
    console.warn('[Vision] No API key configured – returning empty labels');
    return [];
  }

  const body = {
    requests: [
      {
        image: { content: base64Image },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 20 },
          { type: 'WEB_DETECTION', maxResults: 5 },
        ],
      },
    ],
  };

  const response = await fetch(`${VISION_API_BASE}?key=${_apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Vision API error: ${response.status}`);
  }

  const json = await response.json();
  const labels: VisionLabel[] =
    json.responses?.[0]?.labelAnnotations?.map((l: any) => ({
      description: l.description,
      score: l.score,
    })) ?? [];

  return labels;
}

export function labelsToMealResult(
  labels: VisionLabel[],
  nutritionData: MealRecognitionResult['suggestedMacros']
): MealRecognitionResult {
  const topLabel = labels[0] ?? { description: 'Unknown food', score: 0 };
  return {
    mealName: topLabel.description,
    confidence: Math.round(topLabel.score * 100),
    suggestedMacros: nutritionData,
    portions: ['1 serving', '0.5 serving', '1.5 servings'],
    source: 'vision_api',
  };
}
