// Anomaly detection for unusual health patterns

export interface Anomaly {
  metric: string;
  detectedAt: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  value: number;
  expectedRange: { min: number; max: number };
}

export function detectAnomalies(
  metric: string,
  values: number[],
  expectedMin: number,
  expectedMax: number
): Anomaly[] {
  const anomalies: Anomaly[] = [];

  values.forEach((value, index) => {
    if (value < expectedMin || value > expectedMax) {
      const deviation = value < expectedMin
        ? (expectedMin - value) / expectedMin
        : (value - expectedMax) / expectedMax;

      const severity: Anomaly['severity'] =
        deviation > 0.5 ? 'high' : deviation > 0.25 ? 'medium' : 'low';

      const daysAgo = values.length - 1 - index;
      const detectedDate = new Date();
      detectedDate.setDate(detectedDate.getDate() - daysAgo);

      anomalies.push({
        metric,
        detectedAt: detectedDate.toISOString(),
        severity,
        description: `${metric} was ${value} – outside expected range [${expectedMin}, ${expectedMax}]`,
        value,
        expectedRange: { min: expectedMin, max: expectedMax },
      });
    }
  });

  return anomalies;
}

export function detectSleepAnomalies(sleepHours: number[]): Anomaly[] {
  return detectAnomalies('sleep_hours', sleepHours, 6, 9);
}

export function detectCalorieAnomalies(calories: number[]): Anomaly[] {
  return detectAnomalies('calories', calories, 1200, 3500);
}

export function detectHeartRateAnomalies(heartRates: number[]): Anomaly[] {
  return detectAnomalies('heart_rate', heartRates, 40, 100);
}

export function summariseAnomalies(anomalies: Anomaly[]): string {
  if (anomalies.length === 0) return 'No anomalies detected.';
  const high = anomalies.filter((a) => a.severity === 'high').length;
  const medium = anomalies.filter((a) => a.severity === 'medium').length;
  return `${anomalies.length} anomalies detected (${high} high, ${medium} medium severity).`;
}
