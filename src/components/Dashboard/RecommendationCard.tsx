import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Recommendation } from '../../types';
import { theme } from '../../styles/theme';

type Props = {
  recommendation: Recommendation;
  onAction?: (rec: Recommendation) => void;
  onDismiss?: (id: string) => void;
  style?: ViewStyle;
};

const CATEGORY_ICONS: Record<Recommendation['category'], string> = {
  workout: '🏋️',
  nutrition: '🥗',
  sleep: '😴',
  mindfulness: '🧘',
  recovery: '💪',
};

const ACTION_LABELS: Record<string, string> = {
  start_workout: 'Start Workout',
  log_meal: 'Log Meal',
  log_sleep: 'Log Sleep',
  log_rest: 'Log Rest Day',
  set_bedtime_reminder: 'Set Reminder',
  start_meditation: 'Start Session',
};

const PRIORITY_COLORS: Record<Recommendation['priority'], string> = {
  high: theme.colors.error,
  medium: theme.colors.warning,
  low: theme.colors.success,
};

export function RecommendationCard({
  recommendation,
  onAction,
  onDismiss,
  style,
}: Props) {
  const icon = CATEGORY_ICONS[recommendation.category];
  const priorityColor = PRIORITY_COLORS[recommendation.priority];
  const confidencePct = Math.round(recommendation.confidence * 100);
  const actionLabel =
    ACTION_LABELS[recommendation.actionType] ?? 'Take Action';

  return (
    <View style={[styles.card, style]}>
      {/* Priority stripe */}
      <View style={[styles.priorityStripe, { backgroundColor: priorityColor }]} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>{icon}</Text>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={2}>
              {recommendation.title}
            </Text>
            <View style={styles.metaRow}>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: priorityColor + '22' },
                ]}
              >
                <Text style={[styles.priorityText, { color: priorityColor }]}>
                  {recommendation.priority.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.confidence}>{confidencePct}% confidence</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{recommendation.description}</Text>

        {/* Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onAction?.(recommendation)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>{actionLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => onDismiss?.(recommendation.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  priorityStripe: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  icon: {
    fontSize: 28,
    marginRight: theme.spacing.sm,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priorityText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  confidence: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.xs,
  },
  description: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flex: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
  },
  dismissButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  dismissText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
  },
});

export default RecommendationCard;
