// HRV (Heart Rate Variability) analysis
import { Biomarker } from '../../types';
import { createBiomarker } from './biomarkerCalculations';

export function logHRV(userId: string, hrvMs: number): Biomarker {
  return createBiomarker(userId, 'hrv', hrvMs);
}

export function calculateRMSSD(rrIntervals: number[]): number {
  if (rrIntervals.length < 2) return 0;
  const squaredDiffs = rrIntervals
    .slice(1)
    .map((rr, i) => Math.pow(rr - rrIntervals[i], 2));
  const mean = squaredDiffs.reduce((s, v) => s + v, 0) / squaredDiffs.length;
  return Math.round(Math.sqrt(mean));
}

export function calculateSDNN(rrIntervals: number[]): number {
  if (rrIntervals.length < 2) return 0;
  const mean = rrIntervals.reduce((s, v) => s + v, 0) / rrIntervals.length;
  const variance =
    rrIntervals.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / rrIntervals.length;
  return Math.round(Math.sqrt(variance));
}

export function interpretHRV(hrv: number): string {
  if (hrv >= 60) return 'Excellent recovery – ready for high-intensity training.';
  if (hrv >= 40) return 'Good recovery – moderate training is appropriate.';
  if (hrv >= 20) return 'Fair recovery – consider a light workout or rest day.';
  return 'Poor recovery – rest is recommended.';
}

export function getHRVTrend(readings: Biomarker[]): 'improving' | 'declining' | 'stable' {
  const values = readings.filter((r) => r.type === 'hrv').map((r) => r.value);
  if (values.length < 3) return 'stable';
  const recent = values.slice(-3).reduce((s, v) => s + v, 0) / 3;
  const older = values.slice(0, -3).reduce((s, v) => s + v, 0) / Math.max(values.length - 3, 1);
  if (recent > older + 5) return 'improving';
  if (recent < older - 5) return 'declining';
  return 'stable';
}
