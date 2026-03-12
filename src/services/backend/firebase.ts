// Firebase initialization & configuration
// In production, replace these placeholders with actual Firebase config values
// loaded from environment variables or a secure config file.

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY ?? '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.FIREBASE_APP_ID ?? '',
};

let _app: any = null;

export async function initFirebase(): Promise<any> {
  if (_app) return _app;
  try {
    const { initializeApp, getApps } = await import('firebase/app');
    if (getApps().length === 0) {
      _app = initializeApp(firebaseConfig);
    } else {
      _app = getApps()[0];
    }
  } catch {
    // Firebase SDK not available in this environment; using stub
    _app = { name: '[DEFAULT]', options: firebaseConfig };
  }
  return _app;
}

export function getFirebaseApp(): any {
  return _app;
}

export { firebaseConfig };
