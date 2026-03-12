// Fitbit Web API integration
import { WearableDevice, WearableSyncLog } from '../../types';

const FITBIT_API_BASE = 'https://api.fitbit.com/1/user/-';

export interface FitbitTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let _tokens: FitbitTokens | null = null;

export function setFitbitTokens(tokens: FitbitTokens): void {
  _tokens = tokens;
}

export function getFitbitTokens(): FitbitTokens | null {
  return _tokens;
}

export async function fetchFitbitActivitySummary(date: string): Promise<{
  steps: number;
  caloriesOut: number;
  activeMinutes: number;
}> {
  if (!_tokens) {
    return { steps: 0, caloriesOut: 0, activeMinutes: 0 };
  }
  // Real implementation would call: GET ${FITBIT_API_BASE}/activities/date/${date}.json
  console.log(`[Fitbit] Fetching activity summary for ${date} from ${FITBIT_API_BASE}`);
  return { steps: 0, caloriesOut: 0, activeMinutes: 0 };
}

export async function fetchFitbitHeartRate(date: string): Promise<number> {
  if (!_tokens) return 0;
  console.log(`[Fitbit] Fetching heart rate for ${date}`);
  return 0;
}

export async function fetchFitbitSleep(date: string): Promise<number> {
  if (!_tokens) return 0;
  console.log(`[Fitbit] Fetching sleep for ${date}`);
  return 0;
}

export function buildFitbitAuthUrl(clientId: string, redirectUri: string): string {
  const scope = 'activity heartrate sleep nutrition weight';
  return (
    `https://www.fitbit.com/oauth2/authorize?response_type=code` +
    `&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}`
  );
}

export function createFitbitDevice(userId: string): WearableDevice {
  return {
    id: `fitbit_${Date.now()}`,
    type: 'fitbit',
    name: 'Fitbit',
    lastSync: new Date().toISOString(),
    status: 'disconnected',
    userId,
  };
}

export function createFitbitSyncLog(
  deviceId: string,
  steps: number,
  heartRate: number,
  sleepDuration: number,
  caloriesBurned: number
): WearableSyncLog {
  return {
    id: `synclog_${Date.now()}`,
    deviceId,
    dataImported: { steps, heartRate, sleepDuration, caloriesBurned },
    timestamp: new Date().toISOString(),
  };
}
