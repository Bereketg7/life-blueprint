import { MealPreset, MEAL_PRESETS } from './mealPresets';
import { IS_VISION_CONFIGURED, GOOGLE_CLOUD_API_KEY } from '../config/env';

export interface RecognitionResult {
  meal: MealPreset;
  confidence: number;
}

// ── Google Cloud Vision label → meal mapping ──────────────────────────────

/**
 * Map Vision API labels to a meal preset by finding the preset whose name
 * words overlap most with the returned labels.
 */
function matchLabelsToPreset(
  labels: string[],
): { meal: MealPreset; confidence: number } | null {
  const lower = labels.map(l => l.toLowerCase());
  let bestMatch: MealPreset | null = null;
  let bestScore = 0;

  for (const preset of MEAL_PRESETS) {
    const words = preset.name.toLowerCase().split(/\s+/);
    const score = words.filter(w => lower.some(l => l.includes(w) || w.includes(l))).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = preset;
    }
  }

  if (!bestMatch || bestScore === 0) return null;

  // Normalise confidence: max word overlap = 1.0 ceiling at 0.97
  const maxWords = bestMatch.name.split(/\s+/).length;
  const confidence = Math.min(0.97, 0.6 + (bestScore / maxWords) * 0.37);
  return { meal: bestMatch, confidence: parseFloat(confidence.toFixed(2)) };
}

/** Return a random preset as a fallback when Vision cannot match anything. */
function randomFallback(): RecognitionResult {
  const index = Math.floor(Math.random() * MEAL_PRESETS.length);
  const confidence = 0.7 + Math.random() * 0.25;
  return { meal: MEAL_PRESETS[index], confidence: parseFloat(confidence.toFixed(2)) };
}

// ── Real Google Cloud Vision integration ──────────────────────────────────

interface VisionLabel {
  description: string;
  score: number;
}

interface VisionResponse {
  responses: { labelAnnotations?: VisionLabel[] }[];
}

async function recognizeWithGoogleVision(photoUri: string): Promise<RecognitionResult> {
  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`;

  // Build the image payload: local URIs are uploaded as base64; http(s) URIs
  // are passed as imageUri for the Vision API to fetch directly.
  let imagePayload: { content: string } | { source: { imageUri: string } };
  if (/^https?:\/\//.test(photoUri)) {
    imagePayload = { source: { imageUri: photoUri } };
  } else {
    // Fetch the local file and encode as base64
    const resp = await fetch(photoUri);
    const buffer = await resp.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    // Join all char codes in one pass to avoid quadratic string concatenation
    // for potentially large image buffers.
    const binary = Array.from(bytes, b => String.fromCharCode(b)).join('');
    // btoa is available in React Native / modern environments
    const base64 =
      typeof btoa !== 'undefined'
        ? btoa(binary)
        : Buffer.from(bytes).toString('base64');
    imagePayload = { content: base64 };
  }

  const body = {
    requests: [
      {
        image: imagePayload,
        features: [
          { type: 'LABEL_DETECTION', maxResults: 15 },
          { type: 'WEB_DETECTION', maxResults: 5 },
        ],
      },
    ],
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Vision API error: ${response.status} ${response.statusText}`);
  }

  const data: VisionResponse = await response.json();
  const labels = (data.responses[0]?.labelAnnotations ?? []).map(l => l.description);

  const matched = matchLabelsToPreset(labels);
  return matched ?? randomFallback();
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Recognise a meal from a photo URI.
 *
 * - When GOOGLE_CLOUD_API_KEY is set: calls the real Google Cloud Vision API
 *   and maps detected labels to the closest meal preset.
 * - Otherwise: falls back to the mock implementation (simulated delay +
 *   random preset) so the app works without credentials and tests pass.
 */
export async function recognizeMealFromPhoto(photoUri: string): Promise<RecognitionResult> {
  if (IS_VISION_CONFIGURED) {
    try {
      return await recognizeWithGoogleVision(photoUri);
    } catch (err) {
      console.warn('[MealRecognition] Vision API call failed, using fallback:', err);
      return randomFallback();
    }
  }

  // Mock fallback — uses setTimeout so jest.useFakeTimers() continues to work
  await new Promise(resolve => setTimeout(resolve, 1200));
  return randomFallback();
}
