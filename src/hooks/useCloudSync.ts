import { useCallback } from 'react';
import { useSync } from '../context/SyncContext';

interface UseCloudSyncReturn {
  syncNow: () => Promise<void>;
  isSyncing: boolean;
  lastSyncAt: Date | null;
  error: string | null;
}

export function useCloudSync(): UseCloudSyncReturn {
  const { triggerSync, isSyncing, lastSyncAt, syncError } = useSync();

  const syncNow = useCallback(async () => {
    await triggerSync();
  }, [triggerSync]);

  return {
    syncNow,
    isSyncing,
    lastSyncAt,
    error: syncError,
  };
}
