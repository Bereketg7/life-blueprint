// Garmin Connect API integration
import { WearableDevice, WearableSyncLog } from '../../types';

export interface GarminActivity {
  activityId: number;
  activityName: string;
  startTimeLocal: string;
  duration: number;
  calories: number;
  averageHR: number;
  steps: number;
}

let _accessToken: string | null = null;

export function setGarminAccessToken(token: string): void {
  _accessToken = token;
}

export function getGarminAccessToken(): string | null {
  return _accessToken;
}

export async function fetchGarminActivities(startDate: string, endDate: string): Promise<GarminActivity[]> {
  if (!_accessToken) return [];
  // Real implementation: GET https://connectapi.garmin.com/wellness-api/rest/activities
  console.log(`[Garmin] Fetching activities from ${startDate} to ${endDate}`);
  return [];
}

export async function fetchGarminDailySummary(date: string): Promise<{
  steps: number;
  caloriesBurned: number;
  sleepDuration: number;
  heartRate: number;
}> {
  if (!_accessToken) {
    return { steps: 0, caloriesBurned: 0, sleepDuration: 0, heartRate: 0 };
  }
  console.log(`[Garmin] Fetching daily summary for ${date}`);
  return { steps: 0, caloriesBurned: 0, sleepDuration: 0, heartRate: 0 };
}

export function buildGarminAuthUrl(clientId: string, redirectUri: string): string {
  return (
    `https://connect.garmin.com/oauthConfirm?oauth_token=REQUEST_TOKEN` +
    `&oauth_callback=${encodeURIComponent(redirectUri)}&client_id=${clientId}`
  );
}

export function createGarminDevice(userId: string): WearableDevice {
  return {
    id: `garmin_${Date.now()}`,
    type: 'garmin',
    name: 'Garmin',
    lastSync: new Date().toISOString(),
    status: 'disconnected',
    userId,
  };
}

export function createGarminSyncLog(
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
