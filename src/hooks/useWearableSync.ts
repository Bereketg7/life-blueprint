import { useState, useCallback } from 'react';
import { WearableDevice, WearableSyncLog } from '../types';
import { syncAllDevices, syncDevice } from '../services/wearables/wearableSync';

export function useWearableSync() {
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [syncLogs, setSyncLogs] = useState<WearableSyncLog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const addDevice = useCallback((device: WearableDevice) => {
    setDevices((prev) => [...prev, device]);
  }, []);

  const removeDevice = useCallback((deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
  }, []);

  const syncAll = useCallback(async () => {
    setIsSyncing(true);
    try {
      const logs = await syncAllDevices(devices);
      setSyncLogs((prev) => [...prev, ...logs]);
      setLastSync(new Date().toISOString());
    } finally {
      setIsSyncing(false);
    }
  }, [devices]);

  const syncOne = useCallback(async (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;
    setIsSyncing(true);
    try {
      const log = await syncDevice(device);
      setSyncLogs((prev) => [...prev, log]);
      setLastSync(new Date().toISOString());
    } finally {
      setIsSyncing(false);
    }
  }, [devices]);

  return {
    devices,
    syncLogs,
    isSyncing,
    lastSync,
    addDevice,
    removeDevice,
    syncAll,
    syncOne,
  };
}
