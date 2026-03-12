// Doctor data sharing service
import { HealthProvider, ActivityLog, NutritionLog, SleepLog } from '../../types';
import { postObservation, buildWeightObservation } from './fhirIntegration';

export interface HealthShareSummary {
  userId: string;
  shareDate: string;
  activityCount: number;
  avgSleepHours: number;
  avgCalories: number;
  weight?: number;
}

export function buildShareSummary(
  userId: string,
  activityLogs: ActivityLog[],
  nutritionLogs: NutritionLog[],
  sleepLogs: SleepLog[],
  currentWeight?: number
): HealthShareSummary {
  const avgSleepHours =
    sleepLogs.length > 0
      ? sleepLogs.reduce((s, l) => s + l.hoursSlept, 0) / sleepLogs.length
      : 0;

  const avgCalories =
    nutritionLogs.length > 0
      ? nutritionLogs.reduce((s, l) => s + l.calories, 0) / nutritionLogs.length
      : 0;

  return {
    userId,
    shareDate: new Date().toISOString(),
    activityCount: activityLogs.length,
    avgSleepHours: Math.round(avgSleepHours * 10) / 10,
    avgCalories: Math.round(avgCalories),
    weight: currentWeight,
  };
}

export async function shareHealthDataWithProvider(
  provider: HealthProvider,
  patientId: string,
  summary: HealthShareSummary
): Promise<boolean> {
  if (!provider.sharePermissions.weight || !summary.weight) {
    return false;
  }
  const obsId = await postObservation(
    provider,
    buildWeightObservation(patientId, summary.weight, summary.shareDate.split('T')[0])
  );
  return obsId !== null;
}

export function formatSummaryForDoctor(summary: HealthShareSummary): string {
  return `Health Summary (${summary.shareDate.split('T')[0]}):
- Activity sessions: ${summary.activityCount}
- Average sleep: ${summary.avgSleepHours} hrs/night
- Average calories: ${summary.avgCalories} kcal/day
${summary.weight ? `- Current weight: ${summary.weight} kg` : ''}`;
}
