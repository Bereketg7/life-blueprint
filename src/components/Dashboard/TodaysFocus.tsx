import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';
import { DailyPlanItem } from '../../types';

interface TodaysFocusProps {
  items: DailyPlanItem[];
  onUpdateStatus: (itemId: string, status: 'completed' | 'skipped' | 'pending') => void;
}

const TIME_LABELS: Record<string, string> = {
  morning: '🌅 Morning',
  afternoon: '☀️ Afternoon',
  evening: '🌙 Evening',
};

const CATEGORY_COLORS: Record<string, string> = {
  nutrition: '#FF6B6B',
  exercise: Colors.primary,
  supplement: '#4ECDC4',
  recovery: '#FFC107',
  mindfulness: '#9C88FF',
};

const STATUS_ICONS: Record<string, string> = {
  completed: '✅',
  skipped: '⏭️',
  pending: '⬜',
};

const TodaysFocus: React.FC<TodaysFocusProps> = ({ items, onUpdateStatus }) => {
  const grouped = items.reduce<Record<string, DailyPlanItem[]>>((acc, item) => {
    const key = item.timeOfDay;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const timeGroups = ['morning', 'afternoon', 'evening'].filter((t) => grouped[t]?.length > 0);

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Today's Focus</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyText}>No plan items for today</Text>
          <Text style={styles.emptySubtext}>Complete onboarding to generate your plan</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today's Focus</Text>
      {timeGroups.map((time) => (
        <View key={time} style={styles.group}>
          <Text style={styles.timeLabel}>{TIME_LABELS[time] ?? time}</Text>
          {grouped[time].map((item) => {
            const nextStatus: Record<string, 'completed' | 'skipped' | 'pending'> = {
              pending: 'completed',
              completed: 'skipped',
              skipped: 'pending',
            };
            return (
              <View key={item.id} style={[styles.item, item.status === 'completed' && styles.itemDone]}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => onUpdateStatus(item.id, nextStatus[item.status])}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.statusIcon}>{STATUS_ICONS[item.status]}</Text>
                </TouchableOpacity>
                <View style={styles.itemContent}>
                  <View style={styles.itemHeader}>
                    <Text
                      style={[styles.itemTitle, item.status === 'completed' && styles.itemTitleDone]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: `${CATEGORY_COLORS[item.category] ?? Colors.primary}22` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          { color: CATEGORY_COLORS[item.category] ?? Colors.primary },
                        ]}
                      >
                        {item.category}
                      </Text>
                    </View>
                  </View>
                  {item.duration > 0 && (
                    <Text style={styles.duration}>⏱ {item.duration} min</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  group: {
    marginBottom: Spacing.md,
  },
  timeLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
    gap: Spacing.md,
  },
  itemDone: {
    opacity: 0.6,
  },
  checkbox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    fontSize: 20,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  itemTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
    flex: 1,
  },
  itemTitleDone: {
    textDecorationLine: 'line-through',
    color: Colors.text.muted,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    textTransform: 'capitalize',
  },
  duration: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
  },
});

export default TodaysFocus;
