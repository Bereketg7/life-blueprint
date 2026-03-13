import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { UserProfile } from '../../types';
import { colors, spacing, typography, borderRadius, shadow } from '../../styles/theme';

// Extends UserProfile with display fields collected during onboarding
// that belong to the User record rather than UserProfile.
interface OnboardingData extends Partial<UserProfile> {
  name?: string;
  email?: string;
}

interface Props {
  onComplete: (profile: OnboardingData) => void;
}

const HEALTH_CONDITIONS = [
  'PCOS', 'Diabetes', 'Hypertension', 'Hypothyroidism',
  'Asthma', 'Arthritis', 'Heart Disease', 'Anxiety/Depression',
  'IBS', 'Insomnia', 'None of the above',
];

const GOALS: { value: string; label: string; emoji: string }[] = [
  { value: 'weight-loss', label: 'Lose Weight', emoji: '🔥' },
  { value: 'muscle-gain', label: 'Build Muscle', emoji: '💪' },
  { value: 'endurance', label: 'Improve Endurance', emoji: '🏃' },
  { value: 'flexibility', label: 'Increase Flexibility', emoji: '🧘' },
  { value: 'general-wellness', label: 'General Wellness', emoji: '✨' },
  { value: 'stress-reduction', label: 'Reduce Stress', emoji: '🧠' },
  { value: 'sleep-improvement', label: 'Better Sleep', emoji: '😴' },
];

const FITNESS_LEVELS: { value: UserProfile['fitnessLevel']; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const ACTIVITY_LEVELS: { value: UserProfile['activityLevel']; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'lightly-active', label: 'Lightly Active' },
  { value: 'moderately-active', label: 'Moderately Active' },
  { value: 'very-active', label: 'Very Active' },
  { value: 'extra-active', label: 'Extra Active' },
];

const GENDERS: { value: UserProfile['gender']; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const TOTAL_STEPS = 6;

const OnboardingScreen = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<OnboardingData>({
    healthConditions: [],
    secondaryGoals: [],
    primaryGoals: [],
    dietaryRestrictions: [],
    sleepGoal: 8,
    waterGoal: 2500,
    timeAvailablePerDay: 30,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (fields: Partial<OnboardingData>) =>
    setProfile(prev => ({ ...prev, ...fields }));

  const toggleCondition = (condition: string) => {
    const current = profile.healthConditions ?? [];
    if (condition === 'None of the above') {
      update({ healthConditions: current.includes('None of the above') ? [] : ['None of the above'] });
      return;
    }
    const filtered = current.filter(c => c !== 'None of the above');
    if (filtered.includes(condition)) {
      update({ healthConditions: filtered.filter(c => c !== condition) });
    } else {
      update({ healthConditions: [...filtered, condition] });
    }
  };

  const toggleGoal = (goal: string) => {
    const current = profile.primaryGoals ?? [];
    if (current.includes(goal)) {
      update({ primaryGoals: current.filter(g => g !== goal) });
    } else {
      update({ primaryGoals: [...current, goal] });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!profile.name?.trim()) newErrors.name = 'Name is required';
      if (!profile.email?.trim()) newErrors.email = 'Email is required';
    }
    if (step === 1) {
      if (!profile.age) newErrors.age = 'Age is required';
      if (!profile.gender) newErrors.gender = 'Gender is required';
      if (!profile.height) newErrors.height = 'Height is required';
      if (!profile.weight) newErrors.weight = 'Weight is required';
    }
    if (step === 2) {
      if (!profile.primaryGoals || profile.primaryGoals.length === 0) newErrors.primaryGoals = 'Please select at least one goal';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
      setErrors({});
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
      setErrors({});
    }
  };

  const renderStepDots = () => (
    <View style={styles.dotsRow}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
      ))}
    </View>
  );

  const renderStep0 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepEmoji}>👋</Text>
      <Text style={styles.stepTitle}>Welcome to Life Blueprint</Text>
      <Text style={styles.stepSubtitle}>Your personal wellness journey starts here. Let's set up your profile.</Text>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Your Name *</Text>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          placeholder="Enter your name"
          value={profile.name ?? ''}
          onChangeText={v => update({ name: v })}
          placeholderTextColor={colors.text.light}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          placeholder="Enter your email"
          value={profile.email ?? ''}
          onChangeText={v => update({ email: v })}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.text.light}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepEmoji}>📏</Text>
      <Text style={styles.stepTitle}>Personal Metrics</Text>
      <Text style={styles.stepSubtitle}>Help us personalize your wellness plan.</Text>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={[styles.input, errors.age ? styles.inputError : null]}
          placeholder="e.g. 28"
          value={profile.age ? String(profile.age) : ''}
          onChangeText={v => update({ age: parseInt(v) || undefined })}
          keyboardType="numeric"
          placeholderTextColor={colors.text.light}
        />
        {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Gender *</Text>
        <View style={styles.chipRow}>
          {GENDERS.map(g => (
            <TouchableOpacity
              key={g.value}
              style={[styles.chip, profile.gender === g.value && styles.chipSelected]}
              onPress={() => update({ gender: g.value })}
            >
              <Text style={[styles.chipText, profile.gender === g.value && styles.chipTextSelected]}>
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
      </View>
      <View style={styles.row}>
        <View style={[styles.fieldGroup, { flex: 1, marginRight: spacing.sm }]}>
          <Text style={styles.label}>Height (cm) *</Text>
          <TextInput
            style={[styles.input, errors.height ? styles.inputError : null]}
            placeholder="e.g. 170"
            value={profile.height ? String(profile.height) : ''}
            onChangeText={v => update({ height: parseFloat(v) || undefined })}
            keyboardType="numeric"
            placeholderTextColor={colors.text.light}
          />
          {errors.height ? <Text style={styles.errorText}>{errors.height}</Text> : null}
        </View>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Weight (kg) *</Text>
          <TextInput
            style={[styles.input, errors.weight ? styles.inputError : null]}
            placeholder="e.g. 65"
            value={profile.weight ? String(profile.weight) : ''}
            onChangeText={v => update({ weight: parseFloat(v) || undefined })}
            keyboardType="numeric"
            placeholderTextColor={colors.text.light}
          />
          {errors.weight ? <Text style={styles.errorText}>{errors.weight}</Text> : null}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepEmoji}>🎯</Text>
      <Text style={styles.stepTitle}>Your Goals</Text>
      <Text style={styles.stepSubtitle}>What do you want to achieve?</Text>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Select Your Goals *</Text>
        <View style={styles.checkboxGrid}>
          {GOALS.map(g => {
            const selected = (profile.primaryGoals ?? []).includes(g.value);
            return (
              <TouchableOpacity
                key={g.value}
                style={[styles.checkboxItem, selected && styles.checkboxItemSelected]}
                onPress={() => toggleGoal(g.value)}
              >
                <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
                  {selected && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.goalEmoji}>{g.emoji}</Text>
                <Text style={[styles.checkboxLabel, selected && styles.checkboxLabelSelected]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.primaryGoals ? <Text style={styles.errorText}>{errors.primaryGoals}</Text> : null}
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Fitness Level</Text>
        <View style={styles.chipRow}>
          {FITNESS_LEVELS.map(f => (
            <TouchableOpacity
              key={f.value}
              style={[styles.chip, profile.fitnessLevel === f.value && styles.chipSelected]}
              onPress={() => update({ fitnessLevel: f.value })}
            >
              <Text style={[styles.chipText, profile.fitnessLevel === f.value && styles.chipTextSelected]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Activity Level</Text>
        {ACTIVITY_LEVELS.map(a => (
          <TouchableOpacity
            key={a.value}
            style={[styles.chip, profile.activityLevel === a.value && styles.chipSelected, { marginBottom: spacing.xs }]}
            onPress={() => update({ activityLevel: a.value })}
          >
            <Text style={[styles.chipText, profile.activityLevel === a.value && styles.chipTextSelected]}>
              {a.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepEmoji}>🏥</Text>
      <Text style={styles.stepTitle}>Health Conditions</Text>
      <Text style={styles.stepSubtitle}>This helps us tailor safe recommendations for you.</Text>
      <View style={styles.checkboxGrid}>
        {HEALTH_CONDITIONS.map(condition => {
          const selected = (profile.healthConditions ?? []).includes(condition);
          return (
            <TouchableOpacity
              key={condition}
              style={[styles.checkboxItem, selected && styles.checkboxItemSelected]}
              onPress={() => toggleCondition(condition)}
            >
              <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
                {selected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.checkboxLabel, selected && styles.checkboxLabelSelected]}>
                {condition}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepEmoji}>⏰</Text>
      <Text style={styles.stepTitle}>Daily Targets</Text>
      <Text style={styles.stepSubtitle}>Set your baseline wellness targets.</Text>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Time Available Per Day (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 45"
          value={profile.timeAvailablePerDay ? String(profile.timeAvailablePerDay) : ''}
          onChangeText={v => update({ timeAvailablePerDay: parseInt(v) || 30 })}
          keyboardType="numeric"
          placeholderTextColor={colors.text.light}
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Sleep Goal (hours)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 8"
          value={profile.sleepGoal ? String(profile.sleepGoal) : ''}
          onChangeText={v => update({ sleepGoal: parseFloat(v) || 8 })}
          keyboardType="numeric"
          placeholderTextColor={colors.text.light}
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Daily Water Goal (ml)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2500"
          value={profile.waterGoal ? String(profile.waterGoal) : ''}
          onChangeText={v => update({ waterGoal: parseInt(v) || 2500 })}
          keyboardType="numeric"
          placeholderTextColor={colors.text.light}
        />
      </View>
    </View>
  );

  const renderStep5 = () => {
    const goalsLabel = (profile.primaryGoals ?? [])
      .map(v => GOALS.find(g => g.value === v)?.label ?? v)
      .join(', ') || '—';
    const fitnessLabel = FITNESS_LEVELS.find(f => f.value === profile.fitnessLevel)?.label ?? '—';
    const conditions = (profile.healthConditions ?? []).join(', ') || 'None';

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepEmoji}>🚀</Text>
        <Text style={styles.stepTitle}>All Set!</Text>
        <Text style={styles.stepSubtitle}>Here's a summary of your profile.</Text>
        <View style={styles.summaryCard}>
          <SummaryRow icon="👤" label="Name" value={profile.name ?? '—'} />
          <SummaryRow icon="📧" label="Email" value={profile.email ?? '—'} />
          <SummaryRow icon="🎂" label="Age" value={profile.age ? `${profile.age} years` : '—'} />
          <SummaryRow icon="⚖️" label="Height / Weight" value={profile.height && profile.weight ? `${profile.height} cm / ${profile.weight} kg` : '—'} />
          <SummaryRow icon="🎯" label="Goals" value={goalsLabel} />
          <SummaryRow icon="💪" label="Fitness Level" value={fitnessLabel} />
          <SummaryRow icon="🏥" label="Health Conditions" value={conditions} />
          <SummaryRow icon="⏰" label="Daily Time" value={`${profile.timeAvailablePerDay ?? 30} min`} />
          <SummaryRow icon="😴" label="Sleep Goal" value={`${profile.sleepGoal ?? 8} hrs`} />
          <SummaryRow icon="💧" label="Water Goal" value={`${profile.waterGoal ?? 2500} ml`} />
        </View>
        <Text style={styles.summaryNote}>
          Your personalized wellness plan will be generated based on this profile. You can always update it later.
        </Text>
      </View>
    );
  };

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];
  const stepTitles = ['1 of 6', '2 of 6', '3 of 6', '4 of 6', '5 of 6', '6 of 6'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.stepCounter}>{stepTitles[step]}</Text>
        {renderStepDots()}
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {steps[step]()}
      </ScrollView>
      <View style={styles.navRow}>
        {step > 0 ? (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {step === TOTAL_STEPS - 1 ? 'Get Started 🚀' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const SummaryRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryIcon}>{icon}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  stepCounter: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.sm,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.disabled,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  stepContainer: {
    paddingTop: spacing.lg,
  },
  stepEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  stepTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 22,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
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
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: typography.size.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  chipText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  goalCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  goalEmoji: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  goalLabel: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  goalLabelSelected: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  checkboxGrid: {
    gap: spacing.sm,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  checkboxItemSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.disabled,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.surface,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  checkboxLabel: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
  },
  checkboxLabelSelected: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  summaryIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
    width: 28,
  },
  summaryLabel: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: typography.size.sm,
    color: colors.text.primary,
    fontWeight: typography.weight.semibold,
    flex: 1.2,
    textAlign: 'right',
  },
  summaryNote: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  navRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  backBtn: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  nextBtn: {
    flex: 2,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    ...{
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  nextBtnText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.surface,
  },
});

/** @deprecated Use StreamlinedOnboarding for the new 3-step flow. */
export { OnboardingScreen as LegacyOnboardingScreen };

// ─── Re-export the streamlined 3-step onboarding as the default ──────────────
export { default } from './StreamlinedOnboarding';
