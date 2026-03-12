import { useState, useCallback } from 'react';
import { AuthUser } from '../types';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithApple,
  signOut as authSignOut,
} from '../services/backend/auth';
import { useAuthContext } from '../context/AuthContext';

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signInApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { user, loading: ctxLoading, setError, error } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const withLoading = useCallback(
    async (fn: () => Promise<void>) => {
      setLoading(true);
      setError(null);
      try {
        await fn();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'An error occurred';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [setError]
  );

  const signIn = useCallback(
    (email: string, password: string) =>
      withLoading(() => signInWithEmail(email, password).then(() => undefined)),
    [withLoading]
  );

  const signUp = useCallback(
    (email: string, password: string, name: string) =>
      withLoading(() => signUpWithEmail(email, password, name).then(() => undefined)),
    [withLoading]
  );

  const signInGoogle = useCallback(
    () => withLoading(() => signInWithGoogle().then(() => undefined)),
    [withLoading]
  );

  const signInApple = useCallback(
    () => withLoading(() => signInWithApple().then(() => undefined)),
    [withLoading]
  );

  const signOut = useCallback(
    () => withLoading(() => authSignOut()),
    [withLoading]
  );

  return {
    user,
    loading: loading || ctxLoading,
    error,
    signIn,
    signUp,
    signInGoogle,
    signInApple,
    signOut,
  };
}
