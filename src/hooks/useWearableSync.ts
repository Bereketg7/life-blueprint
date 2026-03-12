import { useState, useEffect, useCallback, useRef } from 'react';
import { WearableDevice, WearableSyncLog } from '../types';
import { wearableSyncOrchestrator } from '../services/wearables/wearableSync';

const AUTO_SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

interface UseWearableSyncReturn {
  syncNow: () => Promise<void>;
  isSyncing: boolean;
  connectedDevices: WearableDevice[];
  lastSyncAt: Date | null;
  lastSyncLog: WearableSyncLog | null;
  error: string | null;
}

export function useWearableSync(): UseWearableSyncReturn {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [lastSyncLog, setLastSyncLog] = useState<WearableSyncLog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<WearableDevice[]>(
    wearableSyncOrchestrator.getConnectedDevices()
  );

  // Use a ref so the interval callback always sees the latest isSyncing value
  // without needing it in the dependency array, preventing timer churn.
  const isSyncingRef = useRef(isSyncing);
  isSyncingRef.current = isSyncing;

  const syncNow = useCallback(async () => {
    if (isSyncingRef.current) return;
    setIsSyncing(true);
    setError(null);
    try {
      const log = await wearableSyncOrchestrator.syncAll();
      setLastSyncLog(log);
      setLastSyncAt(new Date());
      setConnectedDevices(wearableSyncOrchestrator.getConnectedDevices());
      if (log.status === 'failed') {
        setError(log.error ?? 'Sync failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  }, []); // stable – reads isSyncingRef instead of closure over isSyncing

  // Auto-sync every 6 hours; created once, never recreated
  useEffect(() => {
    const timer = setInterval(() => {
      syncNow();
    }, AUTO_SYNC_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [syncNow]);

  return { syncNow, isSyncing, connectedDevices, lastSyncAt, lastSyncLog, error };
}
