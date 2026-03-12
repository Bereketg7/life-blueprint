import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { WellnessPlan } from '../../types';
import { colors, spacing, borderRadius, shadow, typography } from '../../styles/theme';
import { formatDuration, formatCalories, formatMacros } from '../../utils/formatting';
import ProgressBar from '../ui/ProgressBar';

interface WeeklyPlanCardProps {
  plan: WellnessPlan;
  onViewDetails?: () => void;
}

export default function WeeklyPlanCard({ plan, onViewDetails }: WeeklyPlanCardProps) {
  const { nutritionPlan, exercisePlan, recoveryProtocol, weeklyGoals } = plan;

  const startDate = new Date(plan.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endDate = new Date(plan.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const totalMacroGrams = nutritionPlan.proteinGrams + nutritionPlan.carbGrams + nutritionPlan.fatGrams;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.weekLabel}>Week {plan.weekNumber}</Text>
          <Text style={styles.dateRange}>{startDate} – {endDate}</Text>
        </View>
        {onViewDetails ? (
          <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails} activeOpacity={0.8}>
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Calorie & Macro Targets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🥗 Nutrition Targets</Text>
        <View style={styles.calorieRow}>
          <Text style={styles.calorieValue}>{formatCalories(nutritionPlan.dailyCalories)}</Text>
          <Text style={styles.calorieLabel}>daily goal</Text>
        </View>
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: colors.category.activity }]}>
              {nutritionPlan.proteinGrams}g
            </Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: colors.category.nutrition }]}>
              {nutritionPlan.carbGrams}g
            </Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: colors.category.mental }]}>
              {nutritionPlan.fatGrams}g
            </Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
        {totalMacroGrams > 0 ? (
          <View style={styles.macroBars}>
            <ProgressBar
              value={nutritionPlan.proteinGrams * 4}
              max={nutritionPlan.dailyCalories}
              color={colors.category.activity}
              label="Protein"
              showPercentage
              height={6}
            />
            <View style={styles.barSpacer} />
            <ProgressBar
              value={nutritionPlan.carbGrams * 4}
              max={nutritionPlan.dailyCalories}
              color={colors.category.nutrition}
              label="Carbs"
              showPercentage
              height={6}
            />
            <View style={styles.barSpacer} />
            <ProgressBar
              value={nutritionPlan.fatGrams * 9}
              max={nutritionPlan.dailyCalories}
              color={colors.category.mental}
              label="Fat"
              showPercentage
              height={6}
            />
          </View>
        ) : null}
      </View>

      {/* Exercise Sessions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏋️ Exercise Plan</Text>
        <View style={styles.exerciseRow}>
          <View style={styles.exerciseStat}>
            <Text style={styles.exerciseStatValue}>{exercisePlan.sessionsPerWeek}</Text>
            <Text style={styles.exerciseStatLabel}>sessions/week</Text>
          </View>
          <View style={styles.exerciseStat}>
            <Text style={styles.exerciseStatValue}>{formatDuration(exercisePlan.sessionDuration)}</Text>
            <Text style={styles.exerciseStatLabel}>per session</Text>
          </View>
          <View style={styles.exerciseStat}>
            <Text style={[styles.exerciseStatValue, styles.intensityBadge,
              exercisePlan.intensity === 'high'
                ? styles.intensityHigh
                : exercisePlan.intensity === 'moderate'
                ? styles.intensityModerate
                : styles.intensityLow,
            ]}>
              {exercisePlan.intensity}
            </Text>
            <Text style={styles.exerciseStatLabel}>intensity</Text>
          </View>
        </View>
        {exercisePlan.focus ? (
          <Text style={styles.focusText}>Focus: {exercisePlan.focus}</Text>
        ) : null}
      </View>

      {/* Weekly Goals */}
      {weeklyGoals.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Weekly Goals</Text>
          {weeklyGoals.slice(0, 3).map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <View style={[styles.goalDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.goalText}>{goal}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Recovery Protocol */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧘 Recovery Protocol</Text>
        <View style={styles.recoveryRow}>
          <Text style={styles.recoveryItem}>
            😴 Sleep goal: {recoveryProtocol.sleepGoal}h
          </Text>
        </View>
        {recoveryProtocol.stressManagement.length > 0 ? (
          <View style={styles.tagRow}>
            {recoveryProtocol.stressManagement.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  weekLabel: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  dateRange: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  detailsButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  detailsButtonText: {
    color: colors.surface,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  section: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  calorieValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  calorieLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  macroLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  macroBars: {
    gap: spacing.xs,
  },
  barSpacer: {
    height: spacing.xs,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  exerciseStat: {
    alignItems: 'center',
  },
  exerciseStatValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  exerciseStatLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  intensityBadge: {
    fontSize: typography.size.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  intensityHigh: {
    backgroundColor: `${colors.error}20`,
    color: colors.error,
  },
  intensityModerate: {
    backgroundColor: `${colors.warning}20`,
    color: colors.warning,
  },
  intensityLow: {
    backgroundColor: `${colors.success}20`,
    color: colors.success,
  },
  focusText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  goalDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  goalText: {
    fontSize: typography.size.sm,
    color: colors.text.primary,
    flex: 1,
  },
  recoveryRow: {
    marginBottom: spacing.sm,
  },
  recoveryItem: {
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: `${colors.accent}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: typography.size.xs,
    color: colors.accent,
    fontWeight: typography.weight.medium,
  },
});