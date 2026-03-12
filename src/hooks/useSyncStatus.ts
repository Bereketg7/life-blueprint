import { useSyncContext } from '../context/SyncContext';

export function useSyncStatus() {
  const { pendingCount, failedCount, isSyncing, retryFailed } = useSyncContext();

  return {
    pendingCount,
    failedCount,
    isSyncing,
    hasPendingChanges: pendingCount > 0,
    hasFailedChanges: failedCount > 0,
    retryFailed,
  };
}
