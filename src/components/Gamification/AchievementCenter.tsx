import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRewards } from '../../hooks/useRewards';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';
import StreakCounter from './StreakCounter';
import BadgeDisplay from './BadgeDisplay';

const MILESTONES = [
  { label: 'Week Warrior', target: 7, description: '7 day streak' },
  { label: 'Monthly Master', target: 30, description: '30 day streak' },
  { label: 'Century Club', target: 100, description: '100 total days' },
];

export default function AchievementCenter() {
  const { streak, badges, totalBadgesEarned } = useRewards();
  const totalBadges = badges.length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Achievements</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Badges Earned</Text>
        <Text style={styles.summaryValue}>
          {totalBadgesEarned} / {totalBadges}
        </Text>
      </View>

      <StreakCounter streak={streak} />

      <Text style={styles.sectionTitle}>Your Badges</Text>
      <BadgeDisplay badges={badges} />

      <Text style={styles.sectionTitle}>Milestones</Text>
      {MILESTONES.map((milestone) => {
        const current =
          milestone.label === 'Century Club'
            ? streak.totalDaysLogged
            : streak.currentStreak;
        const progress = Math.min(current / milestone.target, 1);
        const percentage = Math.round(progress * 100);

        return (
          <View key={milestone.label} style={styles.milestoneCard}>
            <View style={styles.milestoneHeader}>
              <Text style={styles.milestoneName}>{milestone.label}</Text>
              <Text style={styles.milestoneDesc}>{milestone.description}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
            </View>
            <View style={styles.milestoneFooter}>
              <Text style={styles.milestoneProgress}>
                {milestone.label === 'Century Club'
                  ? streak.totalDaysLogged
                  : streak.currentStreak}{' '}
                / {milestone.target}
              </Text>
              <Text style={styles.milestonePercent}>{percentage}%</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  screenTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  summaryLabel: {
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    fontWeight: Typography.weights.medium,
  },
  summaryValue: {
    fontSize: Typography.sizes.xxl,
    color: Colors.text.primary,
    fontWeight: Typography.weights.bold,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  milestoneCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  milestoneName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  milestoneDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
  },
  milestoneFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  milestoneProgress: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
  milestonePercent: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
});
