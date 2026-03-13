/**
 * Firebase Backend Service — Auth, Firestore, Cloud Storage.
 *
 * When FIREBASE_API_KEY (and the other FIREBASE_* vars) are set the service
 * uses the real Firebase JS SDK v10. When they are absent it falls back to
 * the in-memory mock so that the app runs without credentials during
 * development and testing.
 *
 * Set up credentials by copying .env.example to .env and filling in your
 * Firebase project values.
 */

import {
  IS_FIREBASE_CONFIGURED,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from '../../config/env';

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

// ── Offline sync queue (used by both real and mock paths) ─────────────────
const syncQueue: SyncQueueItem[] = [];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ── Lazy Firebase SDK singletons ─────────────────────────────────────────
// We use require() inside functions so the SDK is only loaded when actually
// needed (and never in test/CI environments where the package may not be
// installed and credentials are absent).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _firebaseApp: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _firebaseAuth: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _firestoreDb: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _storage: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getApp(): Promise<any | null> {
  if (!IS_FIREBASE_CONFIGURED) return null;
  if (_firebaseApp) return _firebaseApp;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { initializeApp, getApps } = require('firebase/app');
    const existing = getApps();
    _firebaseApp = existing.length
      ? existing[0]
      : initializeApp({
          apiKey: FIREBASE_API_KEY,
          authDomain: FIREBASE_AUTH_DOMAIN,
          projectId: FIREBASE_PROJECT_ID,
          storageBucket: FIREBASE_STORAGE_BUCKET,
          messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
          appId: FIREBASE_APP_ID,
        });
    return _firebaseApp;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAuth(): Promise<any | null> {
  const app = await getApp();
  if (!app) return null;
  if (_firebaseAuth) return _firebaseAuth;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getAuth: fbGetAuth } = require('firebase/auth');
    _firebaseAuth = fbGetAuth(app);
    return _firebaseAuth;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getFirestore(): Promise<any | null> {
  const app = await getApp();
  if (!app) return null;
  if (_firestoreDb) return _firestoreDb;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getFirestore: fbGetFirestore } = require('firebase/firestore');
    _firestoreDb = fbGetFirestore(app);
    return _firestoreDb;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getStorage(): Promise<any | null> {
  const app = await getApp();
  if (!app) return null;
  if (_storage) return _storage;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getStorage: fbGetStorage } = require('firebase/storage');
    _storage = fbGetStorage(app);
    return _storage;
  } catch {
    return null;
  }
}

// ── Authentication ────────────────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  if (!email || !password) throw new Error('Email and password required');
  const auth = await getAuth();
  if (auth) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { signInWithEmailAndPassword } = require('firebase/auth');
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const u = credential.user;
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
      provider: 'email',
    };
  }
  // Mock fallback
  return {
    uid: generateId(),
    email,
    displayName: email.split('@')[0],
    photoURL: null,
    provider: 'email',
  };
}

export async function signInWithGoogle(): Promise<AuthUser> {
  const auth = await getAuth();
  if (auth) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { GoogleAuthProvider, signInWithPopup } = require('firebase/auth');
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const u = credential.user;
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
      provider: 'google',
    };
  }
  // Mock fallback
  return {
    uid: generateId(),
    email: 'user@gmail.com',
    displayName: 'Google User',
    photoURL: null,
    provider: 'google',
  };
}

export async function signInWithApple(): Promise<AuthUser> {
  const auth = await getAuth();
  if (auth) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { OAuthProvider, signInWithPopup } = require('firebase/auth');
    const provider = new OAuthProvider('apple.com');
    const credential = await signInWithPopup(auth, provider);
    const u = credential.user;
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
      provider: 'apple',
    };
  }
  // Mock fallback
  return {
    uid: generateId(),
    email: null,
    displayName: 'Apple User',
    photoURL: null,
    provider: 'apple',
  };
}

export async function signOut(): Promise<void> {
  const auth = await getAuth();
  if (auth) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { signOut: fbSignOut } = require('firebase/auth');
      await fbSignOut(auth);
      return;
    } catch {
      // fall through to local clear
    }
  }
  // Clear local auth state (mock path)
}

export async function createAccount(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthUser> {
  if (!email || !password) throw new Error('Email and password required');
  const auth = await getAuth();
  if (auth) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    return {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName,
      photoURL: null,
      provider: 'email',
    };
  }
  // Mock fallback
  return {
    uid: generateId(),
    email,
    displayName,
    photoURL: null,
    provider: 'email',
  };
}

// ── Firestore CRUD ────────────────────────────────────────────────────────

export async function createDocument<T extends Record<string, unknown>>(
  collection: string,
  data: T,
): Promise<T & { id: string }> {
  const db = await getFirestore();
  if (db) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { collection: col, addDoc, serverTimestamp } = require('firebase/firestore');
      const docRef = await addDoc(col(db, collection), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return { ...data, id: docRef.id, createdAt: new Date().toISOString() };
    } catch {
      // fall through to mock
    }
  }
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
  const db = await getFirestore();
  if (db) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { doc, updateDoc, serverTimestamp } = require('firebase/firestore');
      await updateDoc(doc(db, collection, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      return;
    } catch {
      // fall through to mock
    }
  }
  const update = { ...data, id, updatedAt: new Date().toISOString() };
  queueForSync(collection, 'update', update);
}

export async function deleteDocument(collection: string, id: string): Promise<void> {
  const db = await getFirestore();
  if (db) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { doc, deleteDoc } = require('firebase/firestore');
      await deleteDoc(doc(db, collection, id));
      return;
    } catch {
      // fall through to mock
    }
  }
  queueForSync(collection, 'delete', { id });
}

export async function getDocument<T>(collection: string, id: string): Promise<T | null> {
  const db = await getFirestore();
  if (db) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { doc, getDoc } = require('firebase/firestore');
      const snap = await getDoc(doc(db, collection, id));
      if (snap.exists()) return { id: snap.id, ...snap.data() } as T;
      return null;
    } catch {
      // fall through to mock
    }
  }
  // Mock: return null
  void collection;
  void id;
  return null;
}

export async function queryCollection<T>(
  collection: string,
  filters: { field: string; operator: '==' | '>' | '<' | '>=' | '<='; value: unknown }[] = [],
): Promise<T[]> {
  const db = await getFirestore();
  if (db) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { collection: col, query, where, getDocs } = require('firebase/firestore');
      let q = col(db, collection);
      if (filters.length) {
        const constraints = filters.map(f => where(f.field, f.operator, f.value));
        q = query(col(db, collection), ...constraints);
      }
      const snap = await getDocs(q);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return snap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as T[];
    } catch {
      // fall through to mock
    }
  }
  // Mock: return empty array
  void collection;
  void filters;
  return [];
}

// ── Cloud Storage ─────────────────────────────────────────────────────────

export async function uploadPhoto(
  userId: string,
  localUri: string,
  filename: string,
): Promise<string> {
  const storage = await getStorage();
  if (storage) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
      const response = await fetch(localUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `users/${userId}/photos/${filename}`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch {
      // fall through to mock
    }
  }
  // Mock fallback
  void userId;
  void localUri;
  return `https://storage.example.com/${filename}`;
}

// ── Offline Sync Queue ────────────────────────────────────────────────────

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
      // Exponential-backoff delay
      const delay = Math.pow(2, item.retryCount) * 100;
      await new Promise(r => setTimeout(r, delay));
      const db = await getFirestore();
      if (db) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { doc, setDoc, updateDoc, deleteDoc } = require('firebase/firestore');
        if (item.operation === 'create') {
          await setDoc(doc(db, item.collection, item.data.id as string), item.data);
        } else if (item.operation === 'update') {
          await updateDoc(doc(db, item.collection, item.data.id as string), item.data);
        } else {
          await deleteDoc(doc(db, item.collection, item.data.id as string));
        }
      }
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
