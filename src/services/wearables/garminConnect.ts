import { WearableActivity, WearableData } from '../../types';

export const GARMIN_API_BASE = 'https://apis.garmin.com/wellness-api/rest';
export const GARMIN_AUTH_URL = 'https://connectapi.garmin.com/oauth-service/oauth';

// ─── OAuth 1.0a Authentication ─────────────────────────────────────────────────

/**
 * Initiates Garmin Connect OAuth1.0a authentication.
 * In production, use an OAuth1 library to sign requests with
 * consumerKey/consumerSecret and open the authorization URL in a WebBrowser.
 */
export async function authenticate(
  consumerKey: string,
  consumerSecret: string
): Promise<string> {
  if (!consumerKey || !consumerSecret) {
    throw new Error('Garmin consumerKey and consumerSecret are required');
  }
  return `garmin_mock_token_${Date.now()}`;
}

// ─── Daily Stats ───────────────────────────────────────────────────────────────

export async function getDailyStats(token: string, date: string): Promise<WearableData> {
  // Production: GET ${GARMIN_API_BASE}/dailies?uploadStartTimeInSeconds=...
  // Headers: Authorization: OAuth oauth_token="${token}" ...
  if (!token) throw new Error('Garmin token required');

  const seed = new Date(date).getDate();
  return {
    deviceId: 'garmin',
    date,
    steps: 8500 + seed * 100,
    heartRate: 65 + (seed % 12),
    caloriesBurned: 2300 + seed * 15,
    activeMinutes: 55 + seed,
    sleepHours: 7 + (seed % 3) * 0.5,
    hrvScore: 45 + (seed % 20),
  };
}

// ─── Activities ────────────────────────────────────────────────────────────────

export async function getActivities(token: string, date: string): Promise<WearableActivity[]> {
  // Production: GET ${GARMIN_API_BASE}/activities
  if (!token) throw new Error('Garmin token required');

  return [
    {
      id: `garmin_act_${date}_1`,
      deviceId: 'garmin',
      type: 'Cycling',
      startTime: `${date}T06:30:00.000Z`,
      endTime: `${date}T07:30:00.000Z`,
      durationMinutes: 60,
      caloriesBurned: 480,
      heartRateAvg: 145,
      heartRateMax: 172,
      steps: 0,
      distance: 28.5,
    },
  ];
}
