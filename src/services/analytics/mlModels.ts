/**
 * Pure-JS statistical / ML helpers used across analytics services.
 */

export interface LinearRegressionResult {
  slope: number;
  intercept: number;
  r2: number;
}

/** Ordinary least-squares linear regression. */
export function linearRegression(
  xValues: number[],
  yValues: number[],
): LinearRegressionResult {
  const n = xValues.length;
  if (n < 2 || n !== yValues.length) {
    return { slope: 0, intercept: yValues[0] ?? 0, r2: 0 };
  }

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: sumY / n, r2: 0 };

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  const meanY = sumY / n;
  const ssTot = yValues.reduce((acc, y) => acc + (y - meanY) ** 2, 0);
  const ssRes = yValues.reduce(
    (acc, y, i) => acc + (y - (slope * xValues[i] + intercept)) ** 2,
    0,
  );
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { slope, intercept, r2 };
}

/** Simple moving average over a sliding window. */
export function movingAverage(values: number[], window: number): number[] {
  if (window <= 0 || values.length === 0) return [];
  return values.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

/** Population standard deviation. */
export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/** Returns indices of outlier values (beyond ±2 SD from mean). */
export function detectOutliers(values: number[]): number[] {
  if (values.length < 3) return [];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sd = standardDeviation(values);
  const threshold = 2;
  return values
    .map((v, i) => (Math.abs(v - mean) > threshold * sd ? i : -1))
    .filter((i) => i !== -1);
}
