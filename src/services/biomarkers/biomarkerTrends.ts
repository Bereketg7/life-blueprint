// Biomarker trend analysis
import { Biomarker, BiomarkerTrend } from '../../types';

export function calcBiomarkerTrend(
  readings: Biomarker[],
  type: Biomarker['type']
): BiomarkerTrend | null {
  const filtered = readings
    .filter((r) => r.type === type)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  if (filtered.length < 2) return null;

  const half = Math.ceil(filtered.length / 2);
  const week1Values = filtered.slice(0, half);
  const week2Values = filtered.slice(half);

  const week1Avg =
    week1Values.reduce((s, r) => s + r.value, 0) / week1Values.length;
  const week2Avg =
    week2Values.reduce((s, r) => s + r.value, 0) / week2Values.length;

  const changePercent =
    week1Avg !== 0 ? Math.round(((week2Avg - week1Avg) / week1Avg) * 100 * 10) / 10 : 0;

  const trend: BiomarkerTrend['trend'] =
    changePercent > 2 ? 'improving' : changePercent < -2 ? 'declining' : 'stable';

  return { type, week1Avg, week2Avg, trend, changePercent };
}

export function getAllBiomarkerTrends(
  readings: Biomarker[]
): BiomarkerTrend[] {
  const types = [...new Set(readings.map((r) => r.type))];
  return types
    .map((t) => calcBiomarkerTrend(readings, t))
    .filter(Boolean) as BiomarkerTrend[];
}

export function getAlertBiomarkers(readings: Biomarker[]): Biomarker[] {
  return readings.filter((r) => r.status === 'alert');
}

export function getWarningBiomarkers(readings: Biomarker[]): Biomarker[] {
  return readings.filter((r) => r.status !== 'normal');
}

export function getLatestReadings(readings: Biomarker[]): Record<string, Biomarker> {
  const latest: Record<string, Biomarker> = {};
  readings.forEach((r) => {
    if (!latest[r.type] || r.timestamp > latest[r.type].timestamp) {
      latest[r.type] = r;
    }
  });
  return latest;
}
