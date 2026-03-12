import { useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { signInWithGoogle, signInWithApple } from '../services/backend/auth';

export function useAuth() {
  const { user, loading, signIn, signUp, logOut } = useAuthContext();

  const signInWithGoogleProvider = useCallback(async () => {
    return signInWithGoogle();
  }, []);

  const signInWithAppleProvider = useCallback(async () => {
    return signInWithApple();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: user !== null,
    signIn,
    signUp,
    logOut,
    signInWithGoogle: signInWithGoogleProvider,
    signInWithApple: signInWithAppleProvider,
  };
}
