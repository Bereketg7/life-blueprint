import { WearableDevice, WearableData, WearableSyncLog } from '../../types';
import { getHealthKitData, isHealthKitAvailable } from './healthkit';
import { getActivities as getFitbitActivities } from './fitbitApi';
import { getDailyStats as getGarminStats } from './garminConnect';

// ─── In-memory device registry ─────────────────────────────────────────────────

let connectedDevices: WearableDevice[] = [];

// ─── WearableSyncOrchestrator ──────────────────────────────────────────────────

export class WearableSyncOrchestrator {
  private onDataCallback: ((data: WearableData) => void) | null = null;

  onData(callback: (data: WearableData) => void): void {
    this.onDataCallback = callback;
  }

  getConnectedDevices(): WearableDevice[] {
    return [...connectedDevices];
  }

  async addDevice(device: WearableDevice): Promise<void> {
    const exists = connectedDevices.some((d) => d.id === device.id);
    if (!exists) {
      connectedDevices.push(device);
    } else {
      connectedDevices = connectedDevices.map((d) =>
        d.id === device.id ? { ...d, ...device } : d
      );
    }
  }

  async removeDevice(deviceId: string): Promise<void> {
    connectedDevices = connectedDevices.filter((d) => d.id !== deviceId);
  }

  async syncDevice(
    deviceType: WearableDevice['type'],
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<WearableSyncLog> {
    const device = connectedDevices.find((d) => d.type === deviceType);
    const logBase = {
      id: `log_${Date.now()}`,
      deviceId: deviceType,
      syncedAt: new Date().toISOString(),
    };

    if (!device?.isConnected) {
      return { ...logBase, recordsImported: 0, status: 'failed', error: 'Device not connected' };
    }

    try {
      let data: WearableData | null = null;

      if (deviceType === 'apple_health') {
        if (!isHealthKitAvailable()) throw new Error('HealthKit not available on this platform');
        data = await getHealthKitData(date);
      } else if (deviceType === 'fitbit') {
        const token = device.authToken ?? '';
        data = await getFitbitActivities(token, date);
      } else if (deviceType === 'garmin') {
        const token = device.authToken ?? '';
        data = await getGarminStats(token, date);
      } else {
        throw new Error(`Unsupported device type: ${deviceType}`);
      }

      if (data && this.onDataCallback) {
        this.onDataCallback(data);
      }

      // Update last sync time
      connectedDevices = connectedDevices.map((d) =>
        d.id === device.id ? { ...d, lastSyncAt: new Date().toISOString() } : d
      );

      return { ...logBase, recordsImported: 1, status: 'success' };
    } catch (err) {
      return {
        ...logBase,
        recordsImported: 0,
        status: 'failed',
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  async syncAll(
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<WearableSyncLog> {
    const activeDevices = connectedDevices.filter((d) => d.isConnected);
    if (activeDevices.length === 0) {
      return {
        id: `log_${Date.now()}`,
        deviceId: 'all',
        syncedAt: new Date().toISOString(),
        recordsImported: 0,
        status: 'failed',
        error: 'No connected devices',
      };
    }

    const results = await Promise.allSettled(
      activeDevices.map((d) => this.syncDevice(d.type, date))
    );

    const logs = results.map((r) => (r.status === 'fulfilled' ? r.value : null)).filter(Boolean) as WearableSyncLog[];
    const totalImported = logs.reduce((sum, l) => sum + l.recordsImported, 0);
    const anyFailed = logs.some((l) => l.status === 'failed');
    const allFailed = logs.every((l) => l.status === 'failed');

    return {
      id: `log_${Date.now()}`,
      deviceId: 'all',
      syncedAt: new Date().toISOString(),
      recordsImported: totalImported,
      status: allFailed ? 'failed' : anyFailed ? 'partial' : 'success',
    };
  }
}

export const wearableSyncOrchestrator = new WearableSyncOrchestrator();
