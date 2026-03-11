import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';

interface HealthSummaryProps {
  activityMinutes: number;
  caloriesConsumed: number;
  sleepHours: number | null;
  moodScore: number | null;
}

interface SummaryCardProps {
  emoji: string;
  label: string;
  value: string;
  unit: string;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ emoji, label, value, unit, color }) => (
  <View style={[cardStyles.card, { borderLeftColor: color }]}>
    <Text style={cardStyles.emoji}>{emoji}</Text>
    <Text style={[cardStyles.value, { color }]}>{value}</Text>
    <Text style={cardStyles.unit}>{unit}</Text>
    <Text style={cardStyles.label}>{label}</Text>
  </View>
);

const cardStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    padding: Spacing.md,
    alignItems: 'center',
    minHeight: 110,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
  },
  unit: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginBottom: 2,
  },
  label: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
});

const HealthSummary: React.FC<HealthSummaryProps> = ({
  activityMinutes,
  caloriesConsumed,
  sleepHours,
  moodScore,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today at a Glance</Text>
      <View style={styles.grid}>
        <View style={styles.row}>
          <SummaryCard
            emoji="🏃"
            label="Activity"
            value={String(activityMinutes)}
            unit="min"
            color={Colors.primary}
          />
          <View style={styles.gap} />
          <SummaryCard
            emoji="🍽️"
            label="Calories"
            value={String(caloriesConsumed)}
            unit="kcal"
            color="#FF6B6B"
          />
        </View>
        <View style={styles.row}>
          <SummaryCard
            emoji="😴"
            label="Sleep"
            value={sleepHours !== null ? sleepHours.toFixed(1) : '--'}
            unit="hrs"
            color="#4ECDC4"
          />
          <View style={styles.gap} />
          <SummaryCard
            emoji="😊"
            label="Mood"
            value={moodScore !== null ? String(moodScore) : '--'}
            unit="/ 10"
            color="#FFC107"
          />
        </View>
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
  grid: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  gap: {
    width: Spacing.sm,
  },
});

export default HealthSummary;
