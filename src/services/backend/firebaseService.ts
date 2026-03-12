// Firebase Real Backend Service - Auth, Firestore, Cloud Storage
// Uses mock implementations when Firebase SDK is not configured

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: 'email' | 'google' | 'apple';
}

export interface SyncQueueItem {
  id: string;
  collection: string;
  operation: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  timestamp: string;
  retryCount: number;
}

// Supported Firestore collections
export const COLLECTIONS = {
  USERS: 'users',
  ACTIVITY_LOGS: 'activityLogs',
  NUTRITION_LOGS: 'nutritionLogs',
  SLEEP_LOGS: 'sleepLogs',
  MENTAL_HEALTH_LOGS: 'mentalHealthLogs',
  QUESTS: 'quests',
  LEVELS: 'userLevels',
  BATTLE_PASS: 'battlePass',
  FRIENDS: 'friends',
  SOCIAL_CHALLENGES: 'socialChallenges',
  BIOMARKERS: 'biomarkers',
  HEALTH_REPORTS: 'healthReports',
  PRESCRIPTIONS: 'prescriptions',
  LAB_RESULTS: 'labResults',
  DOCTOR_SHARES: 'doctorShares',
} as const;

// Offline sync queue
const syncQueue: SyncQueueItem[] = [];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// --- Authentication ---

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  // Mock implementation - replace with real Firebase Auth
  if (!email || !password) throw new Error('Email and password required');
  return {
    uid: generateId(),
    email,
    displayName: email.split('@')[0],
    photoURL: null,
    provider: 'email',
  };
}

export async function signInWithGoogle(): Promise<AuthUser> {
  return {
    uid: generateId(),
    email: 'user@gmail.com',
    displayName: 'Google User',
    photoURL: null,
    provider: 'google',
  };
}

export async function signInWithApple(): Promise<AuthUser> {
  return {
    uid: generateId(),
    email: null,
    displayName: 'Apple User',
    photoURL: null,
    provider: 'apple',
  };
}

export async function signOut(): Promise<void> {
  // Clear local auth state
}

export async function createAccount(email: string, password: string, displayName: string): Promise<AuthUser> {
  if (!email || !password) throw new Error('Email and password required');
  return {
    uid: generateId(),
    email,
    displayName,
    photoURL: null,
    provider: 'email',
  };
}

// --- Firestore CRUD ---

export async function createDocument<T extends Record<string, unknown>>(
  collection: string,
  data: T,
): Promise<T & { id: string }> {
  const id = generateId();
  const doc = { ...data, id, createdAt: new Date().toISOString() };
  queueForSync(collection, 'create', doc);
  return doc;
}

export async function updateDocument<T extends Record<string, unknown>>(
  collection: string,
  id: string,
  data: Partial<T>,
): Promise<void> {
  const update = { ...data, id, updatedAt: new Date().toISOString() };
  queueForSync(collection, 'update', update);
}

export async function deleteDocument(collection: string, id: string): Promise<void> {
  queueForSync(collection, 'delete', { id });
}

export async function getDocument<T>(collection: string, id: string): Promise<T | null> {
  // Mock: return null (real impl would fetch from Firestore)
  void collection;
  void id;
  return null;
}

export async function queryCollection<T>(
  collection: string,
  filters: { field: string; operator: '==' | '>' | '<' | '>=' | '<='; value: unknown }[] = [],
): Promise<T[]> {
  // Mock: return empty array (real impl would query Firestore)
  void collection;
  void filters;
  return [];
}

// --- Cloud Storage ---

export async function uploadPhoto(
  userId: string,
  localUri: string,
  filename: string,
): Promise<string> {
  // Mock: return a placeholder URL
  void userId;
  void localUri;
  return `https://storage.example.com/${filename}`;
}

// --- Offline Sync Queue ---

function queueForSync(
  collection: string,
  operation: SyncQueueItem['operation'],
  data: Record<string, unknown>,
): void {
  syncQueue.push({
    id: generateId(),
    collection,
    operation,
    data,
    timestamp: new Date().toISOString(),
    retryCount: 0,
  });
}

export async function flushSyncQueue(): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  const maxRetries = 3;

  for (const item of [...syncQueue]) {
    try {
      // Exponential-backoff retry logic
      const delay = Math.pow(2, item.retryCount) * 100;
      await new Promise(r => setTimeout(r, delay));
      // Mock success - real impl would call Firebase
      const idx = syncQueue.indexOf(item);
      if (idx !== -1) syncQueue.splice(idx, 1);
      success++;
    } catch {
      item.retryCount++;
      if (item.retryCount >= maxRetries) {
        const idx = syncQueue.indexOf(item);
        if (idx !== -1) syncQueue.splice(idx, 1);
        failed++;
      }
    }
  }
  return { success, failed };
}

export function getSyncQueueLength(): number {
  return syncQueue.length;
}
