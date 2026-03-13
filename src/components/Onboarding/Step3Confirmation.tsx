/**
 * Step 3 — Confirmation: shows the auto-calculated targets and lets the user
 * start the app.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { UserProfile } from '../../types';
import { getActivityLevelLabel } from '../../services/autoCalculations';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface Props {
  profile: UserProfile;
  userName: string;
}

const StatRow = ({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: string;
}) => (
  <View style={styles.statRow}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const Step3Confirmation = ({ profile, userName }: Props) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.stepTitle}>All Set, {userName}! ✨</Text>
    <Text style={styles.stepSubtitle}>
      We've calculated your personalised targets based on your stats.
      You can fine-tune everything in your profile anytime.
    </Text>

    {/* Body stats */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Stats</Text>
      <StatRow emoji="📏" label="Height" value={`${profile.height} cm`} />
      <StatRow emoji="⚖️" label="Weight" value={`${profile.weight} kg`} />
      <StatRow
        emoji="🏃"
        label="Activity"
        value={getActivityLevelLabel(profile.activityLevel)}
      />
    </View>

    {/* Daily targets */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Daily Targets</Text>
      <StatRow emoji="🎯" label="Calories" value={`${profile.calorieGoal} kcal`} />
      <StatRow emoji="💪" label="Protein" value={`${profile.proteinGoal} g`} />
      <StatRow emoji="🥗" label="Carbs" value={`${profile.carbGoal} g`} />
      <StatRow emoji="🥑" label="Fat" value={`${profile.fatGoal} g`} />
      <StatRow emoji="💧" label="Water" value={`${(profile.waterGoal / 1000).toFixed(1)} L`} />
      <StatRow emoji="😴" label="Sleep" value={`${profile.sleepGoal} hours`} />
    </View>

    {/* Goals */}
    {profile.primaryGoals.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Goals</Text>
        <View style={styles.goalsWrap}>
          {profile.primaryGoals.map(g => (
            <View key={g} style={styles.goalChip}>
              <Text style={styles.goalChipText}>{g.replace(/-/g, ' ')}</Text>
            </View>
          ))}
        </View>
      </View>
    )}

    <View style={styles.note}>
      <Text style={styles.noteText}>
        🔒 You can update age, gender, health conditions, and dietary
        preferences at any time from the Profile screen.
      </Text>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { paddingBottom: spacing.xxxl },
  stepTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    marginBottom: spacing.xxl,
    lineHeight: 22,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  statEmoji: { fontSize: 18, width: 26 },
  statLabel: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  goalsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  goalChip: {
    backgroundColor: `${colors.primary}15`,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  goalChipText: {
    fontSize: typography.size.sm,
    color: colors.primary,
    fontWeight: typography.weight.medium,
    textTransform: 'capitalize',
  },
  note: {
    backgroundColor: `${colors.accent}15`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  noteText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default Step3Confirmation;
