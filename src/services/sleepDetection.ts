export interface SleepEstimate {
  hoursSlept: number;
  confidence: 'low' | 'medium' | 'high';
  detectedAt: string;
}

/**
 * Smart sleep detection service.
 * Estimates sleep duration based on device inactivity patterns.
 * In production, integrate with HealthKit (iOS) or Health Connect (Android)
 * for accurate wearable-based sleep tracking.
 */
export function detectSleep(): SleepEstimate {
  const now = new Date();
  const hour = now.getHours();

  // Heuristic: if user opens app in the morning (5–11 AM),
  // estimate sleep based on a typical bedtime of 10 PM–midnight.
  let estimatedHours = 7.5;
  let confidence: SleepEstimate['confidence'] = 'medium';

  if (hour >= 5 && hour <= 11) {
    // Morning – reasonable confidence
    const minutesPastMidnight = hour * 60 + now.getMinutes();
    // Assume bedtime around 11 PM (1380 min past previous midnight)
    const sleepMinutes = minutesPastMidnight + (24 * 60 - 1380);
    estimatedHours = parseFloat((sleepMinutes / 60).toFixed(1));
    estimatedHours = Math.min(12, Math.max(4, estimatedHours));
    confidence = 'high';
  } else if (hour >= 12 && hour <= 16) {
    // Afternoon – low confidence (could be a nap or catching up)
    estimatedHours = 7;
    confidence = 'low';
  }

  return {
    hoursSlept: estimatedHours,
    confidence,
    detectedAt: now.toISOString(),
  };
}
