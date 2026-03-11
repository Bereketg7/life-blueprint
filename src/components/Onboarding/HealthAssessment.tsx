import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';

interface HealthAssessmentProps {
  activityLevel: string;
  healthConditions: string[];
  onActivityChange: (level: string) => void;
  onConditionToggle: (condition: string) => void;
}

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { id: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { id: 'moderately_active', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
  { id: 'very_active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
  { id: 'extra_active', label: 'Extra Active', desc: 'Very hard exercise & physical job' },
];

const CONDITIONS = ['None', 'Diabetes', 'Hypertension', 'Heart Disease', 'PCOS', 'Thyroid'];

const HealthAssessment: React.FC<HealthAssessmentProps> = ({
  activityLevel,
  healthConditions,
  onActivityChange,
  onConditionToggle,
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Health Assessment</Text>

      <Text style={styles.groupLabel}>Activity Level</Text>
      {ACTIVITY_LEVELS.map((lvl) => {
        const active = activityLevel === lvl.id;
        return (
          <TouchableOpacity
            key={lvl.id}
            style={[styles.optionRow, active && styles.optionRowActive]}
            onPress={() => onActivityChange(lvl.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.radio, active && styles.radioActive]}>
              {active && <View style={styles.radioDot} />}
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{lvl.label}</Text>
              <Text style={styles.optionDesc}>{lvl.desc}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <Text style={[styles.groupLabel, { marginTop: Spacing.lg }]}>Health Conditions</Text>
      <Text style={styles.hint}>Select all that apply</Text>
      <View style={styles.chipWrap}>
        {CONDITIONS.map((cond) => {
          const selected = healthConditions.includes(cond);
          return (
            <TouchableOpacity
              key={cond}
              style={[styles.chip, selected && styles.chipActive]}
              onPress={() => onConditionToggle(cond)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>{cond}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  groupLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  hint: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  optionRowActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}18`,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.text.primary,
  },
  optionLabelActive: {
    color: Colors.primary,
  },
  optionDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
    marginTop: 2,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.round,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}22`,
  },
  chipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  chipTextActive: {
    color: Colors.primary,
  },
});

export default HealthAssessment;
