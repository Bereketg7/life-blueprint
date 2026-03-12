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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncNow = useCallback(async () => {
    if (isSyncing) return;
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
  }, [isSyncing]);

  // Auto-sync every 6 hours
  useEffect(() => {
    timerRef.current = setInterval(() => {
      syncNow();
    }, AUTO_SYNC_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [syncNow]);

  return { syncNow, isSyncing, connectedDevices, lastSyncAt, lastSyncLog, error };
}
