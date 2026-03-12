import { auth } from './firebase';
import { AuthUser } from '../../types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function mapFirebaseUser(firebaseUser: Record<string, unknown>): AuthUser {
  const providerData = firebaseUser['providerData'] as Array<{ providerId: string }>;
  const providerId = providerData?.[0]?.providerId ?? 'password';

  let provider: AuthUser['provider'] = 'email';
  if (providerId === 'google.com') provider = 'google';
  else if (providerId === 'apple.com') provider = 'apple';

  return {
    id: firebaseUser['uid'] as string,
    email: (firebaseUser['email'] as string) ?? '',
    name: (firebaseUser['displayName'] as string) ?? (firebaseUser['email'] as string)?.split('@')[0] ?? 'User',
    photoUrl: (firebaseUser['photoURL'] as string) ?? undefined,
    provider,
    createdAt: new Date().toISOString(),
  };
}

// ─── Auth Service ──────────────────────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const { user } = await auth.signInWithEmailAndPassword(email, password);
  return mapFirebaseUser(user);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<AuthUser> {
  const { user } = await auth.createUserWithEmailAndPassword(email, password);
  await auth.updateProfile(user, { displayName: name });
  user['displayName'] = name;
  return mapFirebaseUser(user);
}

export async function signInWithGoogle(): Promise<AuthUser> {
  const googleProvider = { providerId: 'google.com' };
  const { user } = await auth.signInWithPopup(googleProvider);
  return mapFirebaseUser(user);
}

export async function signInWithApple(): Promise<AuthUser> {
  const appleProvider = { providerId: 'apple.com' };
  const { user } = await auth.signInWithPopup(appleProvider);
  user['providerData'] = [{ providerId: 'apple.com' }];
  return mapFirebaseUser(user);
}

export async function signOut(): Promise<void> {
  await auth.signOut();
}

export function getCurrentUser(): AuthUser | null {
  const user = auth.currentUser;
  if (!user) return null;
  return mapFirebaseUser(user);
}

export function onAuthStateChanged(
  callback: (user: AuthUser | null) => void
): () => void {
  return auth.onAuthStateChanged((firebaseUser) => {
    callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
  });
}
