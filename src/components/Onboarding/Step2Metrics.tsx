/**
 * Step 2 — Body Metrics: height, weight, activity level.
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
import { UserProfile } from '../../types';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

export type ActivityLevelKey = UserProfile['activityLevel'];

export interface Step2Data {
  height: string;        // cm (raw text so user can clear the field)
  weight: string;        // kg
  activityLevel: ActivityLevelKey;
}

interface Props {
  data: Step2Data;
  onChange: (data: Partial<Step2Data>) => void;
  errors: Record<string, string>;
}

const ACTIVITY_LEVELS: { value: ActivityLevelKey; label: string; description: string }[] = [
  {
    value: 'sedentary',
    label: 'Sedentary',
    description: 'Desk job, little to no exercise',
  },
  {
    value: 'lightly-active',
    label: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
  },
  {
    value: 'moderately-active',
    label: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
  },
  {
    value: 'very-active',
    label: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
  },
  {
    value: 'extra-active',
    label: 'Extra Active',
    description: 'Physical job + daily training',
  },
];

const Step2Metrics = ({ data, onChange, errors }: Props) => (
  <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
    <Text style={styles.stepTitle}>Your Stats 📊</Text>
    <Text style={styles.stepSubtitle}>
      We'll auto-calculate everything else — just a few numbers.
    </Text>

    {/* Height */}
    <Text style={styles.fieldLabel}>Height (cm)</Text>
    <TextInput
      style={[styles.input, errors.height ? styles.inputError : null]}
      placeholder="e.g. 170"
      value={data.height}
      onChangeText={height => onChange({ height })}
      keyboardType="numeric"
      placeholderTextColor={colors.text.light}
    />
    {errors.height ? <Text style={styles.errorText}>{errors.height}</Text> : null}

    {/* Weight */}
    <Text style={styles.fieldLabel}>Weight (kg)</Text>
    <TextInput
      style={[styles.input, errors.weight ? styles.inputError : null]}
      placeholder="e.g. 68"
      value={data.weight}
      onChangeText={weight => onChange({ weight })}
      keyboardType="numeric"
      placeholderTextColor={colors.text.light}
    />
    {errors.weight ? <Text style={styles.errorText}>{errors.weight}</Text> : null}

    {/* Activity Level */}
    <Text style={styles.fieldLabel}>Activity Level</Text>
    <View style={styles.activityList}>
      {ACTIVITY_LEVELS.map(level => {
        const selected = data.activityLevel === level.value;
        return (
          <TouchableOpacity
            key={level.value}
            style={[styles.activityOption, selected && styles.activityOptionSelected]}
            onPress={() => onChange({ activityLevel: level.value })}
            activeOpacity={0.7}
          >
            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected && <View style={styles.radioDot} />}
            </View>
            <View style={styles.activityText}>
              <Text style={[styles.activityLabel, selected && styles.activityLabelSelected]}>
                {level.label}
              </Text>
              <Text style={styles.activityDesc}>{level.description}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>

    <View style={styles.skipNote}>
      <Text style={styles.skipNoteText}>
        ℹ️  Age, gender, health conditions — all optional. You can set them later in your profile.
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
  errorText: { fontSize: typography.size.xs, color: colors.error, marginTop: spacing.xs },
  activityList: { gap: spacing.sm },
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  activityOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  activityText: { flex: 1 },
  activityLabel: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  activityLabelSelected: { color: colors.primary },
  activityDesc: {
    fontSize: typography.size.sm,
    color: colors.text.light,
    marginTop: 2,
  },
  skipNote: {
    marginTop: spacing.xxl,
    backgroundColor: `${colors.accent}15`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  skipNoteText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default Step2Metrics;
