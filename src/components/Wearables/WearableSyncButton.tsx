import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/theme';

type SyncState = 'idle' | 'syncing' | 'success' | 'error';

interface WearableSyncButtonProps {
  onPress: () => void;
  syncState?: SyncState;
  lastSyncAt?: Date | null;
  style?: object;
}

const STATE_CONFIG: Record<SyncState, { icon: string; label: string; color: string }> = {
  idle:    { icon: '↻',  label: 'Sync Now',    color: Colors.primary },
  syncing: { icon: '↻',  label: 'Syncing…',    color: Colors.primary },
  success: { icon: '✓',  label: 'Synced',       color: Colors.success },
  error:   { icon: '✕',  label: 'Retry Sync',   color: Colors.error },
};

function formatTime(date: Date | null | undefined): string {
  if (!date) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const WearableSyncButton: React.FC<WearableSyncButtonProps> = ({
  onPress,
  syncState = 'idle',
  lastSyncAt,
  style,
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Spin animation while syncing
  useEffect(() => {
    if (syncState === 'syncing') {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [syncState, spinAnim]);

  // Pulse animation on success/error
  useEffect(() => {
    if (syncState === 'success' || syncState === 'error') {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.12, duration: 120, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1,    duration: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [syncState, scaleAnim]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const config = STATE_CONFIG[syncState];

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={syncState === 'syncing'}
        activeOpacity={0.8}
        style={[styles.button, { borderColor: config.color }]}
      >
        <Animated.Text
          style={[
            styles.icon,
            { color: config.color },
            syncState === 'syncing' && { transform: [{ rotate: spin }] },
          ]}
        >
          {config.icon}
        </Animated.Text>
        <View>
          <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
          {lastSyncAt && syncState !== 'syncing' && (
            <Text style={styles.timestamp}>Last: {formatTime(lastSyncAt)}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  icon: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    width: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  timestamp: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginTop: 1,
  },
});

export default WearableSyncButton;
