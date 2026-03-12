import { WearableDevice, WearableData, WearableSyncLog } from '../../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// --- Apple HealthKit Bridge ---
export const appleHealthKit = {
  isAvailable: (): boolean => false, // Would return true on iOS with HealthKit
  requestPermissions: async (): Promise<boolean> => {
    // Real impl: request permissions from iOS HealthKit
    return true;
  },
  getSteps: async (date: string): Promise<number> => {
    void date;
    return Math.floor(Math.random() * 5000) + 3000;
  },
  getHeartRate: async (date: string): Promise<number> => {
    void date;
    return Math.floor(Math.random() * 20) + 65;
  },
  getSleep: async (date: string): Promise<number> => {
    void date;
    return Math.random() * 2 + 6;
  },
  getCaloriesBurned: async (date: string): Promise<number> => {
    void date;
    return Math.floor(Math.random() * 500) + 1500;
  },
};

// --- Fitbit OAuth2 + API Client ---
export const fitbitClient = {
  authorize: async (_clientId: string, _redirectUri: string): Promise<string> => {
    // Real impl: open OAuth2 flow, return access token
    return 'mock_fitbit_token';
  },
  fetchData: async (_token: string, date: string): Promise<WearableData> => {
    return {
      steps: Math.floor(Math.random() * 5000) + 4000,
      heartRate: Math.floor(Math.random() * 20) + 60,
      sleepDuration: Math.random() * 2 + 6,
      caloriesBurned: Math.floor(Math.random() * 600) + 1400,
      date,
    };
  },
};

// --- Garmin Connect OAuth1 + API Client ---
export const garminClient = {
  authorize: async (_consumerKey: string, _consumerSecret: string): Promise<string> => {
    return 'mock_garmin_token';
  },
  fetchData: async (_token: string, date: string): Promise<WearableData> => {
    return {
      steps: Math.floor(Math.random() * 6000) + 3000,
      heartRate: Math.floor(Math.random() * 15) + 62,
      sleepDuration: Math.random() * 2 + 6.5,
      caloriesBurned: Math.floor(Math.random() * 700) + 1600,
      date,
    };
  },
};

// --- Unified Wearable Sync Orchestrator ---
let syncIntervalId: ReturnType<typeof setInterval> | null = null;
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

export async function syncWearableData(device: WearableDevice): Promise<WearableSyncLog> {
  const today = new Date().toISOString().split('T')[0];
  let dataImported = 0;
  let success = false;

  try {
    switch (device.type) {
      case 'apple_health': {
        if (appleHealthKit.isAvailable()) {
          await appleHealthKit.getSteps(today);
          await appleHealthKit.getHeartRate(today);
          await appleHealthKit.getSleep(today);
          await appleHealthKit.getCaloriesBurned(today);
          dataImported = 4;
        }
        break;
      }
      case 'fitbit': {
        const data = await fitbitClient.fetchData('mock_token', today);
        dataImported = Object.keys(data).length - 1; // exclude date
        break;
      }
      case 'garmin': {
        const data = await garminClient.fetchData('mock_token', today);
        dataImported = Object.keys(data).length - 1;
        break;
      }
    }
    success = true;
  } catch {
    success = false;
  }

  return {
    id: generateId(),
    deviceId: device.id,
    dataImported,
    timestamp: new Date().toISOString(),
    success,
  };
}

export function startAutoSync(devices: WearableDevice[], onSync: (log: WearableSyncLog) => void): void {
  if (syncIntervalId) return;
  syncIntervalId = setInterval(async () => {
    for (const device of devices) {
      if (device.status === 'connected') {
        const log = await syncWearableData(device);
        onSync(log);
      }
    }
  }, SYNC_INTERVAL_MS);
}

export function stopAutoSync(): void {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
  }
}

export function createWearableDevice(
  userId: string,
  type: WearableDevice['type'],
  name: string,
): WearableDevice {
  return {
    id: generateId(),
    type,
    name,
    lastSync: new Date().toISOString(),
    status: 'disconnected',
    userId,
  };
}
