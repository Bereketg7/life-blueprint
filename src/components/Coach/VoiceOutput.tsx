import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CoachMessage } from '../../types';
import { theme } from '../../styles/theme';

type Props = {
  message: CoachMessage | null;
  isSpeaking: boolean;
  onPlay?: (message: CoachMessage) => void;
  onStop?: () => void;
};

export function VoiceOutput({ message, isSpeaking, onPlay, onStop }: Props) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.speakerIcon}>🔊</Text>

      <Text style={styles.preview} numberOfLines={1}>
        {isSpeaking ? message.content.slice(0, 50) + '…' : 'Tap to play'}
      </Text>

      <View style={styles.controls}>
        {!isSpeaking ? (
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => message && onPlay?.(message)}
            activeOpacity={0.7}
          >
            <Text style={styles.controlIcon}>▶</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlBtn, styles.stopBtn]}
            onPress={onStop}
            activeOpacity={0.7}
          >
            <Text style={styles.controlIcon}>⏹</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    gap: 8,
  },
  speakerIcon: {
    fontSize: 18,
  },
  preview: {
    flex: 1,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.xs,
  },
  controls: {
    flexDirection: 'row',
    gap: 4,
  },
  controlBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    backgroundColor: theme.colors.error,
  },
  controlIcon: {
    color: theme.colors.text.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default VoiceOutput;
