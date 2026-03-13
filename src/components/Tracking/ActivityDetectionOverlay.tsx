/**
 * ActivityDetectionOverlay — Shows the auto-detected activity type with
 * confidence score and lets the user accept or override it.
 *
 * Rendered inside ActivityTracker once detection completes.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ActivityDetection } from '../../services/motionDetection';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';
import { ActivityLog } from '../../types';

type ActivityType = ActivityLog['type'];

interface Props {
  detection: ActivityDetection | null;
  detecting: boolean;
  onAccept: (type: ActivityType) => void;
  onDismiss: () => void;
  onRetry: () => void;
}

const ActivityDetectionOverlay = ({
  detection,
  detecting,
  onAccept,
  onDismiss,
  onRetry,
}: Props) => {
  if (!detecting && !detection) return null;

  const confidencePct = detection ? Math.round(detection.confidence * 100) : 0;

  return (
    <View style={styles.card}>
      {detecting ? (
        <View style={styles.detectingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <View style={styles.detectingText}>
            <Text style={styles.detectingTitle}>Detecting activity…</Text>
            <Text style={styles.detectingSubtitle}>
              Hold still for 5 seconds while we analyse your motion
            </Text>
          </View>
        </View>
      ) : detection && detection.type !== 'unknown' ? (
        <>
          <View style={styles.resultRow}>
            <Text style={styles.resultEmoji}>{detection.emoji}</Text>
            <View style={styles.resultText}>
              <Text style={styles.resultLabel}>Detected Activity</Text>
              <Text style={styles.resultType}>{detection.label}</Text>
              <Text style={styles.confidence}>{confidencePct}% confidence</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => detection.type !== 'unknown' && onAccept(detection.type as ActivityType)}
            >
              <Text style={styles.acceptBtnText}>✓ Use {detection.label}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
              <Text style={styles.retryBtnText}>↺ Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
              <Text style={styles.dismissBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : detection?.type === 'unknown' ? (
        <View>
          <Text style={styles.unknownText}>
            🔍 Could not detect activity — please select manually.
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
            <Text style={styles.retryBtnText}>↺ Try again</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1.5,
    borderColor: `${colors.primary}35`,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  detectingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  detectingText: { flex: 1 },
  detectingTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  detectingSubtitle: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  resultEmoji: { fontSize: 36 },
  resultText: { flex: 1 },
  resultLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultType: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginTop: 2,
  },
  confidence: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.surface,
  },
  retryBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  retryBtnText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  dismissBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dismissBtnText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  unknownText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
});

export default ActivityDetectionOverlay;
