// Lightweight ML models (TensorFlow Lite stubs)
// In production, replace stubs with actual TFLite model loading via react-native-tflite

export interface ModelMetadata {
  name: string;
  version: string;
  inputShape: number[];
  outputShape: number[];
}

const MODELS: Record<string, ModelMetadata> = {
  weightLossPredictor: {
    name: 'weight_loss_predictor',
    version: '1.0.0',
    inputShape: [1, 10],
    outputShape: [1, 1],
  },
  injuryRiskClassifier: {
    name: 'injury_risk_classifier',
    version: '1.0.0',
    inputShape: [1, 5],
    outputShape: [1, 3],
  },
  burnoutDetector: {
    name: 'burnout_detector',
    version: '1.0.0',
    inputShape: [1, 7],
    outputShape: [1, 2],
  },
};

export function getModelMetadata(modelName: string): ModelMetadata | null {
  return MODELS[modelName] ?? null;
}

export function runInference(
  _modelName: string,
  inputs: number[]
): number[] {
  // Stub implementation: returns normalized input values as predictions
  const sum = inputs.reduce((s, v) => s + v, 0);
  const avg = inputs.length > 0 ? sum / inputs.length : 0;
  return [Math.min(1, Math.max(0, avg / 100))];
}

export function normalizeInputs(
  values: number[],
  mins: number[],
  maxs: number[]
): number[] {
  return values.map((v, i) => {
    const range = maxs[i] - mins[i];
    if (range === 0) return 0;
    return (v - mins[i]) / range;
  });
}

export function listAvailableModels(): string[] {
  return Object.keys(MODELS);
}
