import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StreakData } from '../../types';
import { colors, typography, spacing, borderRadius, shadow } from '../../styles/theme';
import { getStreakMilestoneMessage } from '../../services/rewardsLogic';

interface Props {
  streakData: StreakData;
  recentLogs: { date: string }[];
}

const getLast7Days = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
};

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const StreakCounter = ({ streakData, recentLogs }: Props) => {
  const last7 = getLast7Days();
  const loggedSet = new Set(recentLogs.map(l => l.date));
  const milestoneMessage = getStreakMilestoneMessage(streakData.currentStreak);

  const getMotivationalMessage = (): string => {
    const s = streakData.currentStreak;
    if (s === 0) return "Start your streak today! Every journey begins with a single step. 🌱";
    if (s < 3) return "Great start! Keep the momentum going! 💪";
    if (s < 7) return "You're building a habit! Stay consistent! 🔥";
    if (s < 14) return "One week down! You're on fire! 🚀";
    if (s < 30) return "Two weeks of consistency! Incredible dedication! ⭐";
    if (s < 60) return "One month strong! You're a wellness champion! 🏆";
    return "Elite level consistency! You're an inspiration! 👑";
  };

  return (
    <View style={styles.container}>
      {/* Main streak display */}
      <View style={styles.mainCard}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <Text style={styles.streakNumber}>{streakData.currentStreak}</Text>
        <Text style={styles.streakLabel}>Day Streak</Text>
      </View>

      {/* Last 7 days calendar */}
      <View style={styles.calendarCard}>
        <Text style={styles.calendarTitle}>Last 7 Days</Text>
        <View style={styles.daysRow}>
          {last7.map((date, i) => {
            const dayOfWeek = new Date(date + 'T12:00:00').getDay();
            const isLogged = loggedSet.has(date);
            const isToday = i === 6;
            return (
              <View key={date} style={styles.dayColumn}>
                <Text style={styles.dayLabel}>{DAY_LABELS[dayOfWeek]}</Text>
                <View style={[
                  styles.dayDot,
                  isLogged && styles.dayDotLogged,
                  isToday && !isLogged && styles.dayDotToday,
                ]}>
                  {isLogged && <Text style={styles.dayCheck}>✓</Text>}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatBox emoji="🏆" label="Best Streak" value={`${streakData.longestStreak}d`} />
        <View style={styles.statDivider} />
        <StatBox emoji="📅" label="Total Logged" value={`${streakData.totalDaysLogged}d`} />
        <View style={styles.statDivider} />
        <StatBox emoji="📆" label="Last Log" value={streakData.lastLogDate ? streakData.lastLogDate.slice(5) : '—'} />
      </View>

      {/* Milestone message */}
      {milestoneMessage && (
        <View style={styles.milestoneCard}>
          <Text style={styles.milestoneEmoji}>🎉</Text>
          <Text style={styles.milestoneText}>{milestoneMessage}</Text>
        </View>
      )}

      {/* Motivational message */}
      <View style={styles.motivationCard}>
        <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
      </View>
    </View>
  );
};

const StatBox = ({ emoji, label, value }: { emoji: string; label: string; value: string }) => (
  <View style={styles.statBox}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    ...shadow.md,
    borderTopWidth: 4,
    borderTopColor: colors.warning,
  },
  fireEmoji: { fontSize: 56, marginBottom: spacing.sm },
  streakNumber: {
    fontSize: 64,
    fontWeight: typography.weight.extrabold,
    color: colors.warning,
    lineHeight: 72,
  },
  streakLabel: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadow.sm,
  },
  calendarTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayColumn: { alignItems: 'center', gap: spacing.xs },
  dayLabel: {
    fontSize: typography.size.xs,
    color: colors.text.light,
    fontWeight: typography.weight.medium,
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.disabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotLogged: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  dayDotToday: {
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  dayCheck: {
    fontSize: typography.size.xs,
    color: colors.surface,
    fontWeight: typography.weight.bold,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadow.sm,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statEmoji: { fontSize: 22, marginBottom: spacing.xs },
  statValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.text.light,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  statDivider: { width: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.accent}20`,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  milestoneEmoji: { fontSize: 28 },
  milestoneText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.accent,
    fontWeight: typography.weight.semibold,
    lineHeight: 20,
  },
  motivationCard: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  motivationText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});

export default StreakCounter;