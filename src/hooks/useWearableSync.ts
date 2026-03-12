import { useState, useEffect, useCallback } from 'react';
import { WearableDevice, WearableSyncLog } from '../types';
import { syncWearableData, startAutoSync, stopAutoSync, createWearableDevice } from '../services/wearables';

export function useWearableSync(userId: string) {
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [syncLogs, setSyncLogs] = useState<WearableSyncLog[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    startAutoSync(devices, (log) => {
      setSyncLogs(prev => [log, ...prev]);
    });
    return () => stopAutoSync();
  }, [devices]);

  const connectDevice = useCallback((type: WearableDevice['type'], name: string) => {
    const device = createWearableDevice(userId, type, name);
    const connected = { ...device, status: 'connected' as const };
    setDevices(prev => [...prev, connected]);
    return connected;
  }, [userId]);

  const syncNow = useCallback(async (device: WearableDevice) => {
    setSyncing(true);
    try {
      const log = await syncWearableData(device);
      setSyncLogs(prev => [log, ...prev]);
      setDevices(prev => prev.map(d =>
        d.id === device.id ? { ...d, lastSync: log.timestamp } : d
      ));
      return log;
    } finally {
      setSyncing(false);
    }
  }, []);

  const disconnectDevice = useCallback((deviceId: string) => {
    setDevices(prev => prev.map(d =>
      d.id === deviceId ? { ...d, status: 'disconnected' as const } : d
    ));
  }, []);

  return { devices, syncLogs, syncing, connectDevice, syncNow, disconnectDevice };
}
