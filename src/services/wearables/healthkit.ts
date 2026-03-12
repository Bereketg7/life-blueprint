// Apple HealthKit integration (iOS native)
import { ActivityLog, SleepLog } from '../../types';

export interface HealthKitData {
  steps: number;
  heartRate: number;
  sleepDuration: number;
  caloriesBurned: number;
  date: string;
}

export async function requestHealthKitPermissions(): Promise<boolean> {
  // Requires react-native-health on iOS
  console.log('Requesting HealthKit permissions...');
  return true;
}

export async function fetchTodayHealthKitData(): Promise<HealthKitData> {
  return {
    steps: 0,
    heartRate: 0,
    sleepDuration: 0,
    caloriesBurned: 0,
    date: new Date().toISOString().split('T')[0],
  };
}

export function mapHealthKitToActivityLog(
  data: HealthKitData,
  userId: string
): Omit<ActivityLog, 'id' | 'createdAt'> {
  return {
    userId,
    date: data.date,
    type: 'steps',
    duration: 0,
    intensity: 'low',
    caloriesBurned: data.caloriesBurned,
    notes: `Auto-synced from Apple Health. Steps: ${data.steps}`,
    status: 'completed',
  };
}

export function mapHealthKitToSleepLog(
  data: HealthKitData,
  userId: string
): Omit<SleepLog, 'id' | 'createdAt'> {
  return {
    userId,
    date: data.date,
    hoursSlept: data.sleepDuration,
    quality: 3,
    notes: 'Auto-synced from Apple Health',
  };
}
