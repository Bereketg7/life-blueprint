import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/theme';
import { WearableDevice } from '../../types';
import { wearableSyncOrchestrator } from '../../services/wearables/wearableSync';

interface DeviceConfig {
  type: WearableDevice['type'];
  name: string;
  icon: string;
  description: string;
  availableOn: string;
}

const SUPPORTED_DEVICES: DeviceConfig[] = [
  {
    type: 'apple_health',
    name: 'Apple Health',
    icon: '🍎',
    description: 'Steps, heart rate, sleep & workouts',
    availableOn: 'iOS only',
  },
  {
    type: 'fitbit',
    name: 'Fitbit',
    icon: '⌚',
    description: 'Activity, sleep, heart rate & calories',
    availableOn: 'iOS & Android',
  },
  {
    type: 'garmin',
    name: 'Garmin Connect',
    icon: '🏃',
    description: 'Detailed workouts, HRV & VO2 max',
    availableOn: 'iOS & Android',
  },
  {
    type: 'whoop',
    name: 'WHOOP',
    icon: '💪',
    description: 'Recovery, strain & sleep coach',
    availableOn: 'iOS & Android',
  },
  {
    type: 'oura',
    name: 'Oura Ring',
    icon: '💍',
    description: 'Sleep stages, readiness & HRV',
    availableOn: 'iOS & Android',
  },
];

interface WearableConnectModalProps {
  visible: boolean;
  onClose: () => void;
  connectedDevices: WearableDevice[];
  onDeviceChange?: (devices: WearableDevice[]) => void;
}

export const WearableConnectModal: React.FC<WearableConnectModalProps> = ({
  visible,
  onClose,
  connectedDevices,
  onDeviceChange,
}) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const isConnected = (type: WearableDevice['type']) =>
    connectedDevices.some((d) => d.type === type && d.isConnected);

  const getDevice = (type: WearableDevice['type']) =>
    connectedDevices.find((d) => d.type === type);

  const formatLastSync = (lastSyncAt: string | null): string => {
    if (!lastSyncAt) return 'Never synced';
    const date = new Date(lastSyncAt);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleConnect = async (config: DeviceConfig) => {
    setConnecting(config.type);
    try {
      const newDevice: WearableDevice = {
        id: `${config.type}_${Date.now()}`,
        type: config.type,
        name: config.name,
        isConnected: true,
        lastSyncAt: null,
      };
      await wearableSyncOrchestrator.addDevice(newDevice);
      onDeviceChange?.(wearableSyncOrchestrator.getConnectedDevices());
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (config: DeviceConfig) => {
    setConnecting(config.type);
    try {
      const device = getDevice(config.type);
      if (device) {
        await wearableSyncOrchestrator.removeDevice(device.id);
        onDeviceChange?.(wearableSyncOrchestrator.getConnectedDevices());
      }
    } finally {
      setConnecting(null);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Connect Devices</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Sync your health data automatically from your favourite devices.
        </Text>

        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {SUPPORTED_DEVICES.map((config) => {
            const connected = isConnected(config.type);
            const device = getDevice(config.type);
            const isBusy = connecting === config.type;

            return (
              <View key={config.type} style={styles.deviceCard}>
                <View style={styles.deviceLeft}>
                  <Text style={styles.deviceIcon}>{config.icon}</Text>
                  <View style={styles.deviceInfo}>
                    <View style={styles.deviceNameRow}>
                      <Text style={styles.deviceName}>{config.name}</Text>
                      {connected && (
                        <View style={styles.connectedBadge}>
                          <Text style={styles.connectedBadgeText}>Connected</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.deviceDescription}>{config.description}</Text>
                    <Text style={styles.devicePlatform}>{config.availableOn}</Text>
                    {connected && (
                      <Text style={styles.lastSync}>
                        Last sync: {formatLastSync(device?.lastSyncAt ?? null)}
                      </Text>
                    )}
                  </View>
                </View>

                {isBusy ? (
                  <ActivityIndicator color={Colors.primary} size="small" />
                ) : (
                  <TouchableOpacity
                    style={[styles.actionButton, connected && styles.disconnectButton]}
                    onPress={() => connected ? handleDisconnect(config) : handleConnect(config)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.actionButtonText, connected && styles.disconnectButtonText]}>
                      {connected ? 'Disconnect' : 'Connect'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: Colors.text.secondary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  deviceCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.md,
  },
  deviceLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: Spacing.md,
  },
  deviceIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  deviceName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  connectedBadge: {
    backgroundColor: Colors.success + '33',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
  },
  connectedBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.success,
  },
  deviceDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  devicePlatform: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
  lastSync: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 88,
    alignItems: 'center',
  },
  disconnectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  actionButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  disconnectButtonText: {
    color: Colors.error,
  },
});

export default WearableConnectModal;
