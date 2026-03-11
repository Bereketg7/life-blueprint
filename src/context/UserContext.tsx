import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '../types';

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  saveProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev) =>
      prev ? { ...prev, ...partial, updatedAt: new Date().toISOString() } : prev
    );
  };

  const clearProfile = () => {
    setProfile(null);
  };

  return (
    <UserContext.Provider value={{ profile, loading, error, saveProfile, updateProfile, clearProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
