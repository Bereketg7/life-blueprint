import { WearableData } from '../../types';

export const FITBIT_API_BASE = 'https://api.fitbit.com/1/user/-';
export const FITBIT_AUTH_URL = 'https://www.fitbit.com/oauth2/authorize';

// ─── OAuth Authentication ──────────────────────────────────────────────────────

/**
 * Initiates the Fitbit OAuth2 flow.
 * In production open a WebBrowser session (expo-web-browser) pointing at
 * FITBIT_AUTH_URL with the required scopes, then exchange the code for a token.
 */
export async function authenticate(
  clientId: string,
  redirectUri: string
): Promise<string> {
  if (!clientId || !redirectUri) {
    throw new Error('Fitbit clientId and redirectUri are required');
  }
  // Stub: return a mock access token
  return `fitbit_mock_token_${Date.now()}`;
}

// ─── Activities ────────────────────────────────────────────────────────────────

export async function getActivities(token: string, date: string): Promise<WearableData> {
  // Production: GET ${FITBIT_API_BASE}/activities/date/${date}.json
  // Headers: Authorization: Bearer ${token}
  if (!token) throw new Error('Fitbit token required');

  const seed = new Date(date).getDate();
  return {
    deviceId: 'fitbit',
    date,
    steps: 7000 + seed * 150,
    heartRate: 68 + (seed % 15),
    caloriesBurned: 2100 + seed * 20,
    activeMinutes: 45 + seed,
  };
}

// ─── Sleep ─────────────────────────────────────────────────────────────────────

export async function getSleep(token: string, date: string): Promise<WearableData> {
  // Production: GET ${FITBIT_API_BASE}/sleep/date/${date}.json
  if (!token) throw new Error('Fitbit token required');

  const seed = new Date(date).getDate() % 4;
  return {
    deviceId: 'fitbit',
    date,
    steps: 0,
    heartRate: 55 + seed,
    caloriesBurned: 0,
    activeMinutes: 0,
    sleepHours: 6.5 + seed * 0.3,
  };
}

// ─── Heart Rate ────────────────────────────────────────────────────────────────

export async function getHeartRate(token: string, date: string): Promise<number> {
  // Production: GET ${FITBIT_API_BASE}/activities/heart/date/${date}/1d.json
  if (!token) throw new Error('Fitbit token required');

  const seed = new Date(date).getDate();
  return 62 + (seed % 18);
}
