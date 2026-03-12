/**
 * Mock Firebase implementation that mirrors the Firebase API.
 * In production, replace this file with the actual Firebase SDK:
 *   npm install firebase
 *   import { initializeApp } from 'firebase/app';
 *   import { getAuth } from 'firebase/auth';
 *   import { getFirestore } from 'firebase/firestore';
 *   import { getStorage } from 'firebase/storage';
 */

// ─── In-memory stores ──────────────────────────────────────────────────────────

const firestoreStore: Record<string, Record<string, Record<string, unknown>>> = {};
const storageStore: Record<string, string> = {};
let currentUser: Record<string, unknown> | null = null;
const authListeners: Array<(user: Record<string, unknown> | null) => void> = [];

// ─── Mock App ──────────────────────────────────────────────────────────────────

export const app = {
  name: '[DEFAULT]',
  options: {
    apiKey: 'mock-api-key',
    authDomain: 'life-blueprint.firebaseapp.com',
    projectId: 'life-blueprint',
    storageBucket: 'life-blueprint.appspot.com',
  },
};

// ─── Mock Auth ─────────────────────────────────────────────────────────────────

export const auth = {
  currentUser: null as Record<string, unknown> | null,

  signInWithEmailAndPassword: async (
    email: string,
    password: string
  ): Promise<{ user: Record<string, unknown> }> => {
    if (!email || !password) throw new Error('auth/invalid-email');
    const user = {
      uid: `uid_${email.replace(/[^a-z0-9]/gi, '_')}`,
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      providerData: [{ providerId: 'password' }],
    };
    currentUser = user;
    auth.currentUser = user;
    authListeners.forEach((cb) => cb(user));
    return { user };
  },

  createUserWithEmailAndPassword: async (
    email: string,
    password: string
  ): Promise<{ user: Record<string, unknown> }> => {
    if (!email || !password) throw new Error('auth/weak-password');
    const user = {
      uid: `uid_${Date.now()}`,
      email,
      displayName: null,
      photoURL: null,
      providerData: [{ providerId: 'password' }],
    };
    currentUser = user;
    auth.currentUser = user;
    authListeners.forEach((cb) => cb(user));
    return { user };
  },

  signInWithPopup: async (
    _provider: unknown
  ): Promise<{ user: Record<string, unknown> }> => {
    const user = {
      uid: `uid_social_${Date.now()}`,
      email: 'social@example.com',
      displayName: 'Social User',
      photoURL: null,
      providerData: [{ providerId: 'google.com' }],
    };
    currentUser = user;
    auth.currentUser = user;
    authListeners.forEach((cb) => cb(user));
    return { user };
  },

  signOut: async (): Promise<void> => {
    currentUser = null;
    auth.currentUser = null;
    authListeners.forEach((cb) => cb(null));
  },

  onAuthStateChanged: (callback: (user: Record<string, unknown> | null) => void): (() => void) => {
    authListeners.push(callback);
    // Emit current state immediately
    setTimeout(() => callback(currentUser), 0);
    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx >= 0) authListeners.splice(idx, 1);
    };
  },

  updateProfile: async (
    _user: unknown,
    profile: { displayName?: string; photoURL?: string }
  ): Promise<void> => {
    if (currentUser) {
      Object.assign(currentUser, profile);
    }
  },
};

// ─── Mock Firestore ────────────────────────────────────────────────────────────

const collectionListeners: Record<
  string,
  Array<(docs: Record<string, unknown>[]) => void>
> = {};

function notifyCollectionListeners(collectionPath: string) {
  const docs = Object.values(firestoreStore[collectionPath] ?? {});
  (collectionListeners[collectionPath] ?? []).forEach((cb) => cb(docs));
}

export const db = {
  collection: (collectionPath: string) => ({
    doc: (id?: string) => {
      const docId = id ?? `doc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      return {
        id: docId,
        set: async (data: Record<string, unknown>): Promise<void> => {
          if (!firestoreStore[collectionPath]) firestoreStore[collectionPath] = {};
          firestoreStore[collectionPath][docId] = { ...data, id: docId };
          notifyCollectionListeners(collectionPath);
        },
        get: async (): Promise<{
          exists: boolean;
          id: string;
          data: () => Record<string, unknown> | undefined;
        }> => {
          const doc = firestoreStore[collectionPath]?.[docId];
          return {
            exists: !!doc,
            id: docId,
            data: () => doc,
          };
        },
        update: async (data: Partial<Record<string, unknown>>): Promise<void> => {
          if (!firestoreStore[collectionPath]?.[docId]) throw new Error('Document not found');
          firestoreStore[collectionPath][docId] = {
            ...firestoreStore[collectionPath][docId],
            ...data,
          };
          notifyCollectionListeners(collectionPath);
        },
        delete: async (): Promise<void> => {
          delete firestoreStore[collectionPath]?.[docId];
          notifyCollectionListeners(collectionPath);
        },
      };
    },
    add: async (data: Record<string, unknown>): Promise<{ id: string }> => {
      const docId = `doc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      if (!firestoreStore[collectionPath]) firestoreStore[collectionPath] = {};
      firestoreStore[collectionPath][docId] = { ...data, id: docId };
      notifyCollectionListeners(collectionPath);
      return { id: docId };
    },
    get: async (): Promise<{
      docs: Array<{ id: string; data: () => Record<string, unknown> }>;
    }> => {
      const docs = Object.entries(firestoreStore[collectionPath] ?? {}).map(([id, doc]) => ({
        id,
        data: () => doc,
      }));
      return { docs };
    },
    where: (_field: string, _op: string, _value: unknown) => ({
      get: async (): Promise<{
        docs: Array<{ id: string; data: () => Record<string, unknown> }>;
      }> => {
        const allDocs = Object.entries(firestoreStore[collectionPath] ?? {});
        const filtered = allDocs
          .filter(([, doc]) => {
            const val = (doc as Record<string, unknown>)[_field];
            if (_op === '==') return val === _value;
            if (_op === '!=') return val !== _value;
            if (_op === '>') return (val as number) > (_value as number);
            if (_op === '>=') return (val as number) >= (_value as number);
            if (_op === '<') return (val as number) < (_value as number);
            if (_op === '<=') return (val as number) <= (_value as number);
            if (_op === 'array-contains') return Array.isArray(val) && val.includes(_value);
            return true;
          })
          .map(([id, doc]) => ({ id, data: () => doc }));
        return { docs: filtered };
      },
    }),
    onSnapshot: (callback: (snapshot: { docs: Array<{ id: string; data: () => Record<string, unknown> }> }) => void): (() => void) => {
      if (!collectionListeners[collectionPath]) collectionListeners[collectionPath] = [];
      const listener = (docs: Record<string, unknown>[]) => {
        callback({
          docs: docs.map((doc) => ({
            id: doc['id'] as string,
            data: () => doc,
          })),
        });
      };
      collectionListeners[collectionPath].push(listener);
      // Emit current state immediately
      const current = Object.values(firestoreStore[collectionPath] ?? {});
      setTimeout(() => listener(current), 0);
      return () => {
        const idx = collectionListeners[collectionPath].indexOf(listener);
        if (idx >= 0) collectionListeners[collectionPath].splice(idx, 1);
      };
    },
  }),
};

// ─── Mock Storage ──────────────────────────────────────────────────────────────

export const storage = {
  ref: (path: string) => ({
    path,
    put: async (data: string | Uint8Array): Promise<{ ref: { getDownloadURL: () => Promise<string> } }> => {
      const url = `https://mock-storage.life-blueprint.app/${path}?data=${typeof data === 'string' ? data.slice(0, 20) : 'binary'}`;
      storageStore[path] = url;
      return {
        ref: {
          getDownloadURL: async () => url,
        },
      };
    },
    getDownloadURL: async (): Promise<string> => {
      const url = storageStore[path];
      if (!url) throw new Error('storage/object-not-found');
      return url;
    },
    delete: async (): Promise<void> => {
      delete storageStore[path];
    },
  }),
};
