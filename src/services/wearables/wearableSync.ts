// Unified wearable sync logic
import { WearableDevice, WearableSyncLog } from '../../types';
import { fetchTodayHealthKitData } from './healthkit';
import {
  fetchFitbitActivitySummary,
  fetchFitbitHeartRate,
  fetchFitbitSleep,
  createFitbitSyncLog,
} from './fitbitApi';
import {
  fetchGarminDailySummary,
  createGarminSyncLog,
} from './garminConnect';

const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

let _syncTimer: ReturnType<typeof setInterval> | null = null;

export async function syncDevice(device: WearableDevice): Promise<WearableSyncLog> {
  const today = new Date().toISOString().split('T')[0];

  if (device.type === 'apple_health') {
    const data = await fetchTodayHealthKitData();
    return {
      id: `synclog_${Date.now()}`,
      deviceId: device.id,
      dataImported: {
        steps: data.steps,
        heartRate: data.heartRate,
        sleepDuration: data.sleepDuration,
        caloriesBurned: data.caloriesBurned,
      },
      timestamp: new Date().toISOString(),
    };
  }

  if (device.type === 'fitbit') {
    const [activity, heartRate, sleep] = await Promise.all([
      fetchFitbitActivitySummary(today),
      fetchFitbitHeartRate(today),
      fetchFitbitSleep(today),
    ]);
    return createFitbitSyncLog(
      device.id,
      activity.steps,
      heartRate,
      sleep,
      activity.caloriesOut
    );
  }

  if (device.type === 'garmin') {
    const summary = await fetchGarminDailySummary(today);
    return createGarminSyncLog(
      device.id,
      summary.steps,
      summary.heartRate,
      summary.sleepDuration,
      summary.caloriesBurned
    );
  }

  throw new Error(`Unsupported device type: ${device.type}`);
}

export async function syncAllDevices(devices: WearableDevice[]): Promise<WearableSyncLog[]> {
  const connected = devices.filter((d) => d.status === 'connected');
  return Promise.all(connected.map((d) => syncDevice(d)));
}

export function startAutoSync(
  devices: WearableDevice[],
  onSync: (logs: WearableSyncLog[]) => void
): void {
  if (_syncTimer) return;
  _syncTimer = setInterval(async () => {
    const logs = await syncAllDevices(devices);
    onSync(logs);
  }, SYNC_INTERVAL_MS);
}

export function stopAutoSync(): void {
  if (_syncTimer) {
    clearInterval(_syncTimer);
    _syncTimer = null;
  }
}

export function resolveConflict(
  wearableValue: number,
  manualValue: number,
  strategy: 'wearable_wins' | 'manual_wins' | 'higher_wins' | 'lower_wins'
): number {
  switch (strategy) {
    case 'wearable_wins': return wearableValue;
    case 'manual_wins': return manualValue;
    case 'higher_wins': return Math.max(wearableValue, manualValue);
    case 'lower_wins': return Math.min(wearableValue, manualValue);
  }
}
