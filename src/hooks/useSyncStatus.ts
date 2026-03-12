import { useSync } from '../context/SyncContext';

interface UseSyncStatusReturn {
  pendingCount: number;
  isSyncing: boolean;
  lastSyncAt: Date | null;
  syncError: string | null;
}

export function useSyncStatus(): UseSyncStatusReturn {
  const { pendingCount, isSyncing, lastSyncAt, syncError } = useSync();
  return { pendingCount, isSyncing, lastSyncAt, syncError };
}
