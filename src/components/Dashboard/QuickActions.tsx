import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';

interface QuickActionsProps {
  onLogActivity: () => void;
  onLogMeal: () => void;
  onLogSleep: () => void;
  onLogMood: () => void;
}

const ACTIONS = [
  { emoji: '📊', label: 'Activity', key: 'activity' as const },
  { emoji: '🍽️', label: 'Meal', key: 'meal' as const },
  { emoji: '😴', label: 'Sleep', key: 'sleep' as const },
  { emoji: '😊', label: 'Mood', key: 'mood' as const },
];

const QuickActions: React.FC<QuickActionsProps> = ({
  onLogActivity,
  onLogMeal,
  onLogSleep,
  onLogMood,
}) => {
  const handlers: Record<string, () => void> = {
    activity: onLogActivity,
    meal: onLogMeal,
    sleep: onLogSleep,
    mood: onLogMood,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Log</Text>
      <View style={styles.row}>
        {ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.key}
            style={styles.btn}
            onPress={handlers[action.key]}
            activeOpacity={0.75}
          >
            <View style={styles.iconWrap}>
              <Text style={styles.emoji}>{action.emoji}</Text>
            </View>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.primary}22`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
});

export default QuickActions;
