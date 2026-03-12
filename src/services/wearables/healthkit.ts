import { Platform } from 'react-native';
import { SleepData, WearableData, WearableWorkout } from '../../types';

// ─── Availability ──────────────────────────────────────────────────────────────

export function isHealthKitAvailable(): boolean {
  return Platform.OS === 'ios';
}

// ─── Mock permission / data helpers ───────────────────────────────────────────
// In production, replace with react-native-health or expo-health SDK calls.

export async function requestHealthKitPermissions(): Promise<boolean> {
  if (!isHealthKitAvailable()) return false;
  // Production: use AppleHealthKit.initHealthKit({ permissions }) → callback
  return true;
}

export async function getSteps(date: string): Promise<number> {
  if (!isHealthKitAvailable()) return 0;
  // Production: AppleHealthKit.getStepCount({ date }) → result.value
  const seed = new Date(date).getDate();
  return 4000 + seed * 200;
}

export async function getHeartRate(date: string): Promise<number> {
  if (!isHealthKitAvailable()) return 0;
  // Production: AppleHealthKit.getHeartRateSamples({ startDate, endDate }) → avg
  const seed = new Date(date).getDate();
  return 60 + (seed % 20);
}

export async function getSleepData(date: string): Promise<SleepData> {
  if (!isHealthKitAvailable()) {
    return {
      date,
      totalHours: 0,
      deepSleepHours: 0,
      remSleepHours: 0,
      lightSleepHours: 0,
      awakeMinutes: 0,
      efficiency: 0,
    };
  }
  // Production: AppleHealthKit.getSleepSamples({ startDate, endDate }) → samples
  const seed = new Date(date).getDate() % 3;
  return {
    date,
    totalHours: 7 + seed,
    deepSleepHours: 1.5 + seed * 0.2,
    remSleepHours: 1.2 + seed * 0.1,
    lightSleepHours: 4.3 - seed * 0.1,
    awakeMinutes: 12 + seed * 3,
    efficiency: 85 + seed * 2,
  };
}

export async function getWorkouts(date: string): Promise<WearableWorkout[]> {
  if (!isHealthKitAvailable()) return [];
  // Production: AppleHealthKit.getSamples({ type: 'Workout', startDate }) → samples
  return [
    {
      id: `hk_workout_${date}`,
      type: 'Running',
      startTime: `${date}T07:00:00.000Z`,
      endTime: `${date}T07:35:00.000Z`,
      durationMinutes: 35,
      caloriesBurned: 320,
      heartRateAvg: 152,
      source: 'apple_health',
    },
  ];
}

// ─── WearableData aggregate ────────────────────────────────────────────────────

export async function getHealthKitData(date: string): Promise<WearableData> {
  const [steps, heartRate, sleep] = await Promise.all([
    getSteps(date),
    getHeartRate(date),
    getSleepData(date),
  ]);

  return {
    deviceId: 'apple_health',
    date,
    steps,
    heartRate,
    caloriesBurned: Math.round(steps * 0.04),
    activeMinutes: Math.round(steps / 100),
    sleepHours: sleep.totalHours,
  };
}
