import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useHealth } from '../context/HealthContext';
import { colors, typography, spacing, borderRadius, shadow } from '../styles/theme';
import { PlannedExercise } from '../types';

const MacroBar = ({
  label,
  value,
  goal,
  color,
}: {
  label: string;
  value: number;
  goal: number;
  color: string;
}) => {
  const pct = goal > 0 ? Math.min(1, value / goal) : 0;
  return (
    <View style={styles.macroRow}>
      <Text style={styles.macroLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.round(pct * 100)}%` as `${number}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.macroValue}>
        {value}g / {goal}g
      </Text>
    </View>
  );
};

const ExerciseRow = ({ ex }: { ex: PlannedExercise }) => (
  <View style={styles.exerciseRow}>
    <Text style={styles.exerciseName}>• {ex.name}</Text>
    <Text style={styles.exerciseMeta}>
      {ex.sets ? `${ex.sets}×${ex.reps ?? '?'} reps` : ex.duration ? `${ex.duration} min` : ''}
      {ex.restTime ? `  Rest: ${ex.restTime}s` : ''}
    </Text>
  </View>
);

const PlanScreen = () => {
  const { currentPlan, todayNutrition, userProfile } = useHealth();

  const totalCalories = todayNutrition.reduce((s, n) => s + n.calories, 0);
  const totalProtein = todayNutrition.reduce((s, n) => s + n.protein, 0);
  const totalCarbs = todayNutrition.reduce((s, n) => s + n.carbs, 0);
  const totalFat = todayNutrition.reduce((s, n) => s + n.fat, 0);

  if (!currentPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.screenTitle}>Plan</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>No Active Plan</Text>
          <Text style={styles.emptySubtitle}>
            Complete your onboarding to generate a personalised wellness plan.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { nutritionPlan, exercisePlan, recoveryProtocol, weeklyGoals, weekNumber, startDate, endDate } =
    currentPlan;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Plan</Text>

        {/* Week header */}
        <View style={styles.card}>
          <Text style={styles.weekLabel}>Week {weekNumber}</Text>
          <Text style={styles.dateRange}>
            {startDate} – {endDate}
          </Text>
        </View>

        {/* Weekly goals */}
        {weeklyGoals.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🎯 Weekly Goals</Text>
            {weeklyGoals.map((g, i) => (
              <Text key={i} style={styles.bulletItem}>
                • {g}
              </Text>
            ))}
          </View>
        )}

        {/* Exercise plan */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🏋️ Exercise Plan</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{exercisePlan.sessionsPerWeek}</Text>
              <Text style={styles.statLabel}>Sessions/wk</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{exercisePlan.sessionDuration}</Text>
              <Text style={styles.statLabel}>Min/session</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{exercisePlan.intensity}</Text>
              <Text style={styles.statLabel}>Intensity</Text>
            </View>
          </View>
          {exercisePlan.focus ? (
            <Text style={styles.focusText}>Focus: {exercisePlan.focus}</Text>
          ) : null}
          {exercisePlan.exercises.map((ex, i) => (
            <ExerciseRow key={i} ex={ex} />
          ))}
        </View>

        {/* Nutrition targets */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🥗 Nutrition Targets</Text>
          <MacroBar
            label="Calories"
            value={totalCalories}
            goal={nutritionPlan.dailyCalories}
            color={colors.category.nutrition}
          />
          <MacroBar
            label="Protein"
            value={totalProtein}
            goal={nutritionPlan.proteinGrams}
            color={colors.category.activity}
          />
          <MacroBar
            label="Carbs"
            value={totalCarbs}
            goal={nutritionPlan.carbGrams}
            color={colors.warning}
          />
          <MacroBar
            label="Fat"
            value={totalFat}
            goal={nutritionPlan.fatGrams}
            color={colors.category.mental}
          />
          <Text style={styles.subNote}>
            💧 Hydration goal: {nutritionPlan.hydrationGoal} ml/day
          </Text>
          {nutritionPlan.supplements.length > 0 && (
            <Text style={styles.subNote}>
              💊 Supplements: {nutritionPlan.supplements.join(', ')}
            </Text>
          )}
        </View>

        {/* Recovery protocol */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🛌 Recovery Protocol</Text>
          <Text style={styles.subNote}>
            😴 Sleep goal: {recoveryProtocol.sleepGoal}h / night
          </Text>
          {recoveryProtocol.stressManagement.length > 0 && (
            <>
              <Text style={styles.subSectionTitle}>Stress Management</Text>
              {recoveryProtocol.stressManagement.map((s, i) => (
                <Text key={i} style={styles.bulletItem}>• {s}</Text>
              ))}
            </>
          )}
          {recoveryProtocol.recoveryActivities.length > 0 && (
            <>
              <Text style={styles.subSectionTitle}>Recovery Activities</Text>
              {recoveryProtocol.recoveryActivities.map((a, i) => (
                <Text key={i} style={styles.bulletItem}>• {a}</Text>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  screenTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  weekLabel: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  dateRange: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subSectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  bulletItem: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    textTransform: 'capitalize',
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  focusText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  exerciseRow: {
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
  },
  exerciseMeta: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  macroLabel: {
    width: 64,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  macroValue: {
    width: 90,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: 'right',
  },
  subNote: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default PlanScreen;
