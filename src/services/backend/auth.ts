// Authentication service – Email, Google, Apple Sign-In
import { AuthUser } from '../../types';

let _currentUser: AuthUser | null = null;
const _listeners: Array<(user: AuthUser | null) => void> = [];

function notifyListeners(user: AuthUser | null): void {
  _listeners.forEach((cb) => cb(user));
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const user: AuthUser = {
    uid: `uid_${Date.now()}`,
    email,
    displayName: email.split('@')[0],
    photoURL: '',
  };
  _currentUser = user;
  notifyListeners(user);
  return user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  const user: AuthUser = {
    uid: `uid_${Date.now()}`,
    email,
    displayName,
    photoURL: '',
  };
  _currentUser = user;
  notifyListeners(user);
  return user;
}

export async function signInWithGoogle(): Promise<AuthUser> {
  const user: AuthUser = {
    uid: `google_${Date.now()}`,
    email: 'user@gmail.com',
    displayName: 'Google User',
    photoURL: '',
  };
  _currentUser = user;
  notifyListeners(user);
  return user;
}

export async function signInWithApple(): Promise<AuthUser> {
  const user: AuthUser = {
    uid: `apple_${Date.now()}`,
    email: 'user@icloud.com',
    displayName: 'Apple User',
    photoURL: '',
  };
  _currentUser = user;
  notifyListeners(user);
  return user;
}

export async function signOut(): Promise<void> {
  _currentUser = null;
  notifyListeners(null);
}

export function getCurrentUser(): AuthUser | null {
  return _currentUser;
}

export function onAuthStateChanged(
  callback: (user: AuthUser | null) => void
): () => void {
  _listeners.push(callback);
  callback(_currentUser);
  return () => {
    const idx = _listeners.indexOf(callback);
    if (idx !== -1) _listeners.splice(idx, 1);
  };
}
