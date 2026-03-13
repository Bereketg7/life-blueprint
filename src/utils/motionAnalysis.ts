/**
 * Motion analysis math utilities.
 *
 * These functions process raw accelerometer samples and derive higher-level
 * motion features (cadence, bounce, magnitude) used by motionDetection.ts.
 *
 * ⚠️  The motion detection pipeline is designed to be connected to a real
 * accelerometer (e.g., expo-sensors `Accelerometer`) once that dependency is
 * added.  The math here is sensor-agnostic.
 */

export interface MotionSample {
  x: number;
  y: number;
  z: number;
  timestamp: number; // ms since epoch
}

/** Total acceleration magnitude for a single sample. */
export function magnitude(sample: MotionSample): number {
  return Math.sqrt(sample.x ** 2 + sample.y ** 2 + sample.z ** 2);
}

/** Mean of an array of numbers. */
function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Variance of an array of numbers. */
function variance(values: number[]): number {
  if (values.length === 0) return 0;
  const m = mean(values);
  return mean(values.map(v => (v - m) ** 2));
}

/**
 * Estimate steps-per-minute (cadence) from magnitude signal.
 *
 * A "step" is detected every time the magnitude crosses the mean from
 * below to above (zero-crossing on the mean-subtracted signal).
 */
export function calculateCadence(buffer: MotionSample[]): number {
  if (buffer.length < 2) return 0;

  const magnitudes = buffer.map(magnitude);
  const avg = mean(magnitudes);
  const normalized = magnitudes.map(m => m - avg);

  let crossings = 0;
  for (let i = 1; i < normalized.length; i++) {
    if (normalized[i - 1] < 0 && normalized[i] >= 0) {
      crossings++;
    }
  }

  // Duration in minutes
  const durationMs = buffer[buffer.length - 1].timestamp - buffer[0].timestamp;
  if (durationMs <= 0) return 0;
  const durationMin = durationMs / 60000;

  return crossings / durationMin;
}

/**
 * Calculate vertical bounce (variance of z-axis values).
 * Higher values indicate more up-down movement (running vs. cycling).
 */
export function calculateBounce(buffer: MotionSample[]): number {
  if (buffer.length === 0) return 0;
  return variance(buffer.map(s => s.z));
}

/**
 * Approximate movement intensity from magnitude variance.
 * This is a proxy for speed when GPS data is unavailable.
 */
export function calculateIntensityScore(buffer: MotionSample[]): number {
  if (buffer.length === 0) return 0;
  return variance(buffer.map(magnitude));
}

/**
 * Smooth a number series with a simple rolling average.
 */
export function rollingAverage(values: number[], windowSize: number): number[] {
  return values.map((_, i) => {
    const start = Math.max(0, i - windowSize + 1);
    return mean(values.slice(start, i + 1));
  });
}
