/**
 * Step 1 — Essentials: name + multi-select goals.
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

export interface Step1Data {
  name: string;
  primaryGoals: string[];
}

interface Props {
  data: Step1Data;
  onChange: (data: Partial<Step1Data>) => void;
  errors: Record<string, string>;
}

export const AVAILABLE_GOALS = [
  { value: 'weight-loss',       label: 'Lose Weight',         emoji: '🔥' },
  { value: 'muscle-gain',       label: 'Build Muscle',        emoji: '💪' },
  { value: 'endurance',         label: 'Improve Endurance',   emoji: '🏃' },
  { value: 'stress-reduction',  label: 'Reduce Stress',       emoji: '🧠' },
  { value: 'sleep-improvement', label: 'Better Sleep',        emoji: '😴' },
  { value: 'flexibility',       label: 'Increase Flexibility', emoji: '🧘' },
  { value: 'general-wellness',  label: 'General Wellness',    emoji: '✨' },
];

const Step1Essentials = ({ data, onChange, errors }: Props) => {
  const toggleGoal = (value: string) => {
    const current = data.primaryGoals;
    if (current.includes(value)) {
      onChange({ primaryGoals: current.filter(g => g !== value) });
    } else {
      onChange({ primaryGoals: [...current, value] });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.stepTitle}>Welcome! Let's get started 🎯</Text>
      <Text style={styles.stepSubtitle}>
        Just two questions to personalise your experience.
      </Text>

      {/* Name */}
      <Text style={styles.fieldLabel}>What's your name?</Text>
      <TextInput
        style={[styles.input, errors.name ? styles.inputError : null]}
        placeholder="e.g. Alice"
        value={data.name}
        onChangeText={name => onChange({ name })}
        autoCapitalize="words"
        placeholderTextColor={colors.text.light}
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      {/* Goals */}
      <Text style={styles.fieldLabel}>What are your goals? (pick any)</Text>
      <View style={styles.goalsGrid}>
        {AVAILABLE_GOALS.map(goal => {
          const selected = data.primaryGoals.includes(goal.value);
          return (
            <TouchableOpacity
              key={goal.value}
              style={[styles.goalCard, selected && styles.goalCardSelected]}
              onPress={() => toggleGoal(goal.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              <Text style={[styles.goalLabel, selected && styles.goalLabelSelected]}>
                {goal.label}
              </Text>
              {selected && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
      {errors.primaryGoals ? (
        <Text style={styles.errorText}>{errors.primaryGoals}</Text>
      ) : null}
    </ScrollView>
  );
};

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
  fieldLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  inputError: { borderColor: colors.error },
  errorText: {
    fontSize: typography.size.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  goalCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  goalCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  goalEmoji: { fontSize: 20 },
  goalLabel: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  goalLabelSelected: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  checkmark: {
    fontSize: typography.size.sm,
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
});

export default Step1Essentials;
