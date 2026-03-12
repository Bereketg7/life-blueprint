import {
  ActivityLog,
  NutritionLog,
  SleepLog,
  MentalHealthLog,
  Anomaly,
} from '../../types';
import { standardDeviation, detectOutliers } from './mlModels';

type Logs = {
  activityLogs?: ActivityLog[];
  nutritionLogs?: NutritionLog[];
  sleepLogs?: SleepLog[];
  mentalHealthLogs?: MentalHealthLog[];
};

function severityFromZScore(z: number): Anomaly['severity'] {
  const abs = Math.abs(z);
  if (abs > 3) return 'high';
  if (abs > 2.5) return 'medium';
  return 'low';
}

export function detectAnomalies(logs: Logs): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // ── Sleep anomalies ───────────────────────────────────────────────────────
  const sleepLogs = (logs.sleepLogs ?? []).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  if (sleepLogs.length >= 5) {
    const durations = sleepLogs.map((l) => l.hoursSlept);
    const mean = durations.reduce((a, b) => a + b, 0) / durations.length;
    const sd = standardDeviation(durations);
    const outlierIndices = detectOutliers(durations);
    for (const idx of outlierIndices) {
      const z = (durations[idx] - mean) / (sd || 1);
      anomalies.push({
        metric: 'sleep_duration',
        date: sleepLogs[idx].date,
        value: durations[idx],
        expectedRange: {
          min: parseFloat((mean - 2 * sd).toFixed(2)),
          max: parseFloat((mean + 2 * sd).toFixed(2)),
        },
        severity: severityFromZScore(z),
        description:
          durations[idx] < mean
            ? `Unusually short sleep: ${durations[idx].toFixed(1)} hrs (avg ${mean.toFixed(1)} hrs)`
            : `Unusually long sleep: ${durations[idx].toFixed(1)} hrs (avg ${mean.toFixed(1)} hrs)`,
      });
    }
  }

  // ── Activity anomalies ────────────────────────────────────────────────────
  const activityLogs = (logs.activityLogs ?? []).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  if (activityLogs.length >= 5) {
    const durations = activityLogs.map((l) => l.duration ?? 0);
    const mean = durations.reduce((a, b) => a + b, 0) / durations.length;
    const sd = standardDeviation(durations);
    const outlierIndices = detectOutliers(durations);
    for (const idx of outlierIndices) {
      const z = (durations[idx] - mean) / (sd || 1);
      anomalies.push({
        metric: 'activity_duration',
        date: activityLogs[idx].date,
        value: durations[idx],
        expectedRange: {
          min: parseFloat((mean - 2 * sd).toFixed(2)),
          max: parseFloat((mean + 2 * sd).toFixed(2)),
        },
        severity: severityFromZScore(z),
        description:
          durations[idx] < mean
            ? `Activity drop detected: only ${durations[idx]} min (avg ${mean.toFixed(0)} min)`
            : `Unusually long session: ${durations[idx]} min (avg ${mean.toFixed(0)} min)`,
      });
    }
  }

  // ── Calorie anomalies ─────────────────────────────────────────────────────
  const nutritionLogs = (logs.nutritionLogs ?? []).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  if (nutritionLogs.length >= 5) {
    const calories = nutritionLogs.map((l) => l.calories);
    const mean = calories.reduce((a, b) => a + b, 0) / calories.length;
    const sd = standardDeviation(calories);
    const outlierIndices = detectOutliers(calories);
    for (const idx of outlierIndices) {
      const z = (calories[idx] - mean) / (sd || 1);
      anomalies.push({
        metric: 'calorie_intake',
        date: nutritionLogs[idx].date,
        value: calories[idx],
        expectedRange: {
          min: parseFloat((mean - 2 * sd).toFixed(0)),
          max: parseFloat((mean + 2 * sd).toFixed(0)),
        },
        severity: severityFromZScore(z),
        description:
          calories[idx] < mean
            ? `Very low calorie day: ${calories[idx]} kcal (avg ${mean.toFixed(0)} kcal)`
            : `Unusually high calorie day: ${calories[idx]} kcal (avg ${mean.toFixed(0)} kcal)`,
      });
    }
  }

  // ── Mood anomalies ────────────────────────────────────────────────────────
  const mentalHealthLogs = (logs.mentalHealthLogs ?? []).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  if (mentalHealthLogs.length >= 5) {
    const moods = mentalHealthLogs.map((l) => l.mood);
    const mean = moods.reduce((a, b) => a + b, 0) / moods.length;
    const sd = standardDeviation(moods);
    const outlierIndices = detectOutliers(moods);
    for (const idx of outlierIndices) {
      const z = (moods[idx] - mean) / (sd || 1);
      anomalies.push({
        metric: 'mood_score',
        date: mentalHealthLogs[idx].date,
        value: moods[idx],
        expectedRange: {
          min: parseFloat((mean - 2 * sd).toFixed(1)),
          max: parseFloat((mean + 2 * sd).toFixed(1)),
        },
        severity: severityFromZScore(z),
        description:
          moods[idx] < mean
            ? `Low mood detected: ${moods[idx]}/10 (avg ${mean.toFixed(1)}/10)`
            : `Unusually high mood: ${moods[idx]}/10 (avg ${mean.toFixed(1)}/10)`,
      });
    }
  }

  return anomalies;
}
