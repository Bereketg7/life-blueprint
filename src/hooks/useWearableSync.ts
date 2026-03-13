import { useState, useEffect, useCallback } from 'react';
import { WearableDevice, WearableSyncLog, ActivityLog, SleepLog } from '../types';
import { syncWearableData, startAutoSync, stopAutoSync, createWearableDevice, fetchWearableData } from '../services/wearables';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Convert steps count to estimated walking duration in minutes */
function stepsToMinutes(steps: number): number {
  // Rough estimate: 100 steps/minute at moderate pace
  return Math.round(steps / 100);
}

/** Convert steps to estimated calories burned */
function stepsToCalories(steps: number, weightKg = 70): number {
  // ~0.04 kcal per step at 70 kg
  return Math.round(steps * 0.04 * (weightKg / 70));
}

/** Minimum steps in a day to auto-create a walking activity log */
const MIN_STEPS_FOR_AUTO_IMPORT = 10000;

/** Name used for auto-synced walking activity logs */
const AUTO_SYNC_ACTIVITY_NAME = 'Walking (Auto-synced)';

export function useWearableSync(userId: string, weightKg = 70) {
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [syncLogs, setSyncLogs] = useState<WearableSyncLog[]>([]);
  const [syncing, setSyncing] = useState(false);
  /** Activity logs auto-imported from wearables */
  const [importedActivities, setImportedActivities] = useState<ActivityLog[]>([]);
  /** Sleep log auto-imported from wearable */
  const [importedSleep, setImportedSleep] = useState<SleepLog | null>(null);

  /** Fetch wearable data for a device and convert to health logs */
  const importFromDevice = useCallback(async (device: WearableDevice) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const data = await fetchWearableData(device);
    if (!data) return;

    if (data.steps >= MIN_STEPS_FOR_AUTO_IMPORT) {
      const activity: ActivityLog = {
        id: generateId(),
        userId,
        date: today,
        type: 'walking',
        name: AUTO_SYNC_ACTIVITY_NAME,
        duration: stepsToMinutes(data.steps),
        intensity: 'moderate',
        caloriesBurned: stepsToCalories(data.steps, weightKg),
        createdAt: new Date().toISOString(),
      };
      setImportedActivities(prev => {
        // Replace any existing auto-synced walking for today
        const filtered = prev.filter(a => !(a.date === today && a.name === AUTO_SYNC_ACTIVITY_NAME));
        return [activity, ...filtered];
      });
    }

    // Auto-fill sleep log from wearable
    if (data.sleepDuration && data.sleepDuration > 0) {
      const sleep: SleepLog = {
        id: generateId(),
        userId,
        date: yesterday,
        duration: data.sleepDuration,
        quality: 3, // default neutral quality; user can override
        createdAt: new Date().toISOString(),
      };
      setImportedSleep(sleep);
    }
  }, [userId, weightKg]);

  useEffect(() => {
    startAutoSync(devices, async (log) => {
      setSyncLogs(prev => [log, ...prev]);
      // After each sync, re-import wearable data into logs
      const device = devices.find(d => d.id === log.deviceId);
      if (device && log.success) {
        await importFromDevice(device);
      }
    });
    return () => stopAutoSync();
  }, [devices, importFromDevice]);

  const connectDevice = useCallback((type: WearableDevice['type'], name: string) => {
    const device = createWearableDevice(userId, type, name);
    const connected = { ...device, status: 'connected' as const };
    setDevices(prev => [...prev, connected]);
    return connected;
  }, [userId]);

  const syncNow = useCallback(async (device: WearableDevice) => {
    setSyncing(true);
    try {
      const log = await syncWearableData(device);
      setSyncLogs(prev => [log, ...prev]);
      setDevices(prev => prev.map(d =>
        d.id === device.id ? { ...d, lastSync: log.timestamp } : d
      ));
      if (log.success) {
        await importFromDevice(device);
      }
      return log;
    } finally {
      setSyncing(false);
    }
  }, [importFromDevice]);

  const disconnectDevice = useCallback((deviceId: string) => {
    setDevices(prev => prev.map(d =>
      d.id === deviceId ? { ...d, status: 'disconnected' as const } : d
    ));
  }, []);

  return {
    devices,
    syncLogs,
    syncing,
    importedActivities,
    importedSleep,
    connectDevice,
    syncNow,
    disconnectDevice,
  };
}
