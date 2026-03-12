import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/theme';
import { WearableDevice } from '../../types';

interface WearableStatusProps {
  devices: WearableDevice[];
  onManagePress?: () => void;
}

const DEVICE_ICONS: Record<WearableDevice['type'], string> = {
  apple_health: '🍎',
  fitbit: '⌚',
  garmin: '🏃',
  whoop: '💪',
  oura: '💍',
};

function formatLastSync(lastSyncAt: string | null): string {
  if (!lastSyncAt) return 'Never';
  const diff = Date.now() - new Date(lastSyncAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export const WearableStatus: React.FC<WearableStatusProps> = ({ devices, onManagePress }) => {
  const connected = devices.filter((d) => d.isConnected);

  if (connected.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>📡</Text>
        <Text style={styles.emptyText}>No wearables connected</Text>
        {onManagePress && (
          <TouchableOpacity style={styles.connectButton} onPress={onManagePress} activeOpacity={0.8}>
            <Text style={styles.connectButtonText}>Connect a Device</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Connected Devices</Text>
        {onManagePress && (
          <TouchableOpacity onPress={onManagePress} activeOpacity={0.7}>
            <Text style={styles.manageText}>Manage</Text>
          </TouchableOpacity>
        )}
      </View>

      {connected.map((device) => (
        <View key={device.id} style={styles.deviceRow}>
          <View style={styles.deviceLeft}>
            <Text style={styles.deviceIcon}>{DEVICE_ICONS[device.type]}</Text>
            <View>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.lastSync}>Last sync: {formatLastSync(device.lastSyncAt)}</Text>
            </View>
          </View>

          <View style={styles.deviceRight}>
            {device.batteryLevel !== undefined && (
              <View style={styles.batteryContainer}>
                <Text style={styles.batteryText}>{device.batteryLevel}%</Text>
                <View style={styles.batteryBar}>
                  <View
                    style={[
                      styles.batteryFill,
                      {
                        width: `${device.batteryLevel}%` as `${number}%`,
                        backgroundColor:
                          device.batteryLevel > 50
                            ? Colors.success
                            : device.batteryLevel > 20
                            ? Colors.warning
                            : Colors.error,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
            <View style={styles.statusDot} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  manageText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  deviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  deviceIcon: {
    fontSize: 24,
    marginRight: Spacing.xs,
  },
  deviceName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
  },
  lastSync: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  deviceRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  batteryContainer: {
    alignItems: 'flex-end',
  },
  batteryText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
  batteryBar: {
    width: 32,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 2,
  },
  batteryFill: {
    height: '100%',
    borderRadius: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  connectButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  connectButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
});

export default WearableStatus;
