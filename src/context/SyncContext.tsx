import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { defaultSyncQueue } from '../services/backend/syncManager';

interface SyncContextType {
  isSyncing: boolean;
  lastSyncAt: Date | null;
  pendingCount: number;
  syncError: string | null;
  triggerSync: () => Promise<void>;
  refreshStatus: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(
    defaultSyncQueue.getPendingCount()
  );

  const refreshStatus = useCallback(() => {
    setPendingCount(defaultSyncQueue.getPendingCount());
  }, []);

  const triggerSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      await defaultSyncQueue.processQueue();
      await defaultSyncQueue.retryFailed();
      setLastSyncAt(new Date());
      setPendingCount(defaultSyncQueue.getPendingCount());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sync failed';
      setSyncError(msg);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  return (
    <SyncContext.Provider
      value={{ isSyncing, lastSyncAt, pendingCount, syncError, triggerSync, refreshStatus }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = (): SyncContextType => {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSync must be used within a SyncProvider');
  return ctx;
};
