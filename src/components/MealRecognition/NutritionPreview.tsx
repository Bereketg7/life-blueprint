import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/theme';

interface NutritionPreviewProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calorieGoal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
}

interface MacroRingProps {
  value: number;
  goal?: number;
  label: string;
  unit: string;
  color: string;
  size?: number;
}

const MacroRing: React.FC<MacroRingProps> = ({
  value,
  goal,
  label,
  unit,
  color,
  size = 76,
}) => {
  const progress = goal ? Math.min(value / goal, 1) : 0;
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedProgress]);

  const strokeWidth = 7;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[ringStyles.container, { width: size + Spacing.lg, alignItems: 'center' }]}>
      {/* Simulated ring using View borders since react-native SVG isn't available */}
      <View
        style={[
          ringStyles.ringOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color + '33',
            borderWidth: strokeWidth,
          },
        ]}
      >
        {/* Progress arc overlay — approximated with a solid partial border */}
        <View
          style={[
            ringStyles.ringInner,
            {
              width: size - strokeWidth * 2,
              height: size - strokeWidth * 2,
              borderRadius: (size - strokeWidth * 2) / 2,
            },
          ]}
        >
          <Text style={[ringStyles.valueText, { color }]}>{value}</Text>
          <Text style={ringStyles.unitText}>{unit}</Text>
        </View>
      </View>

      <View
        style={[
          ringStyles.progressOverlay,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color,
            borderWidth: strokeWidth,
            opacity: 0,
          },
        ]}
        pointerEvents="none"
      />

      <Text style={[ringStyles.label, { color }]}>{label}</Text>
      {goal !== undefined && (
        <Text style={ringStyles.goalText}>
          {Math.round(progress * 100)}% of {goal}{unit}
        </Text>
      )}
    </View>
  );
};

const ringStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ringOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressOverlay: {
    position: 'absolute',
  },
  valueText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  unitText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    marginTop: 2,
  },
  goalText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
});

// ─── Main Component ────────────────────────────────────────────────────────────

export const NutritionPreview: React.FC<NutritionPreviewProps> = ({
  calories,
  protein,
  carbs,
  fat,
  calorieGoal,
  proteinGoal,
  carbsGoal,
  fatGoal,
}) => {
  const calProgress = calorieGoal ? Math.min(calories / calorieGoal, 1) : null;

  return (
    <View style={styles.container}>
      {/* Calories banner */}
      <View style={styles.caloriesBanner}>
        <Text style={styles.caloriesLabel}>Total Calories</Text>
        <Text style={styles.caloriesValue}>{calories} kcal</Text>
        {calorieGoal !== undefined && calProgress !== null && (
          <View style={styles.caloriesBarBg}>
            <Animated.View
              style={[
                styles.caloriesBarFill,
                {
                  width: `${Math.round(calProgress * 100)}%`,
                  backgroundColor:
                    calProgress > 1
                      ? Colors.error
                      : calProgress > 0.85
                      ? Colors.warning
                      : Colors.success,
                },
              ]}
            />
          </View>
        )}
        {calorieGoal !== undefined && (
          <Text style={styles.caloriesGoalText}>
            {calories} / {calorieGoal} kcal daily goal
          </Text>
        )}
      </View>

      {/* Macro rings */}
      <View style={styles.ringsRow}>
        <MacroRing
          value={protein}
          goal={proteinGoal}
          label="Protein"
          unit="g"
          color="#FF6B6B"
        />
        <MacroRing
          value={carbs}
          goal={carbsGoal}
          label="Carbs"
          unit="g"
          color="#FFC107"
        />
        <MacroRing
          value={fat}
          goal={fatGoal}
          label="Fat"
          unit="g"
          color="#4CAF50"
        />
      </View>

      {/* Macro bars */}
      <View style={styles.barsSection}>
        {[
          { label: 'Protein', value: protein, unit: 'g', goal: proteinGoal, color: '#FF6B6B' },
          { label: 'Carbs',   value: carbs,   unit: 'g', goal: carbsGoal,   color: '#FFC107' },
          { label: 'Fat',     value: fat,     unit: 'g', goal: fatGoal,     color: '#4CAF50' },
        ].map(({ label, value, unit, goal, color }) => {
          const prog = goal ? Math.min(value / goal, 1) : value / Math.max(protein + carbs + fat, 1);
          return (
            <View key={label} style={styles.barRow}>
              <Text style={styles.barLabel}>{label}</Text>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${Math.round(prog * 100)}%`, backgroundColor: color },
                  ]}
                />
              </View>
              <Text style={[styles.barValue, { color }]}>
                {value}{unit}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  caloriesBanner: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  caloriesLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  caloriesValue: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  caloriesBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  caloriesBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  caloriesGoalText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    ...Shadows.sm,
  },
  barsSection: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  barLabel: {
    width: 52,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  barValue: {
    width: 44,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    textAlign: 'right',
  },
});

export default NutritionPreview;
