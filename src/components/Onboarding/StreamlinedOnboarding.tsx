/**
 * StreamlinedOnboarding — 3-step onboarding container.
 *
 * Step 1: Essentials (name + goals)
 * Step 2: Body metrics (height, weight, activity level)
 * Step 3: Confirmation (auto-calculated targets)
 *
 * Total time: ~2-3 minutes with only 5 required form fields.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Step1Essentials, { Step1Data } from './Step1Essentials';
import Step2Metrics, { Step2Data, ActivityLevelKey } from './Step2Metrics';
import Step3Confirmation from './Step3Confirmation';
import { autoCalculateProfile } from '../../services/autoCalculations';
import { UserProfile } from '../../types';
import { colors, typography, spacing, borderRadius, shadow } from '../../styles/theme';

interface Props {
  onComplete: (profile: UserProfile) => void;
  userId?: string;
}

const TOTAL_STEPS = 3;

const StreamlinedOnboarding = ({ onComplete, userId = 'guest' }: Props) => {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [step1, setStep1] = useState<Step1Data>({
    name: '',
    primaryGoals: [],
  });

  const [step2, setStep2] = useState<Step2Data>({
    height: '',
    weight: '',
    activityLevel: 'moderately-active' as ActivityLevelKey,
  });

  // Computed profile — only available after step 2 is complete
  const [computedProfile, setComputedProfile] = useState<UserProfile | null>(null);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!step1.name.trim()) newErrors.name = 'Please enter your name';
    if (step1.primaryGoals.length === 0)
      newErrors.primaryGoals = 'Please select at least one goal';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const h = parseFloat(step2.height);
    const w = parseFloat(step2.weight);
    if (!step2.height || isNaN(h) || h < 50 || h > 300)
      newErrors.height = 'Enter a valid height (50-300 cm)';
    if (!step2.weight || isNaN(w) || w < 20 || w > 500)
      newErrors.weight = 'Enter a valid weight (20-500 kg)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goNext = () => {
    setErrors({});
    if (step === 0 && !validateStep1()) return;
    if (step === 1) {
      if (!validateStep2()) return;
      // Pre-compute profile so Step 3 can render immediately
      const profile = autoCalculateProfile(
        {
          name: step1.name.trim(),
          height: parseFloat(step2.height),
          weight: parseFloat(step2.weight),
          activityLevel: step2.activityLevel,
          primaryGoals: step1.primaryGoals,
        },
        userId,
      );
      setComputedProfile(profile);
    }
    setStep(s => s + 1);
  };

  const goBack = () => {
    setErrors({});
    setStep(s => Math.max(0, s - 1));
  };

  const handleComplete = () => {
    if (computedProfile) {
      onComplete(computedProfile);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const stepTitles = ['Essentials', 'Your Stats', 'Confirmation'];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Progress header */}
      <View style={styles.header}>
        {step > 0 ? (
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}
        <Text style={styles.stepIndicator}>
          Step {step + 1} of {TOTAL_STEPS}
        </Text>
        <View style={styles.backBtnPlaceholder} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((step + 1) / TOTAL_STEPS) * 100}%` },
          ]}
        />
      </View>

      {/* Step label */}
      <View style={styles.stepLabelRow}>
        {stepTitles.map((title, i) => (
          <Text
            key={title}
            style={[styles.stepLabel, i === step && styles.stepLabelActive]}
          >
            {title}
          </Text>
        ))}
      </View>

      {/* Step content */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.stepContent}>
          {step === 0 && (
            <Step1Essentials data={step1} onChange={d => setStep1(p => ({ ...p, ...d }))} errors={errors} />
          )}
          {step === 1 && (
            <Step2Metrics data={step2} onChange={d => setStep2(p => ({ ...p, ...d }))} errors={errors} />
          )}
          {step === 2 && computedProfile && (
            <Step3Confirmation profile={computedProfile} userName={step1.name.trim()} />
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Footer button */}
      <View style={styles.footer}>
        {step < TOTAL_STEPS - 1 ? (
          <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
            <Text style={styles.nextBtnText}>Next →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.doneBtn} onPress={handleComplete}>
            <Text style={styles.doneBtnText}>Let's Go! 🚀</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backBtn: { padding: spacing.sm },
  backBtnText: {
    fontSize: typography.size.md,
    color: colors.primary,
    fontWeight: typography.weight.medium,
  },
  backBtnPlaceholder: { width: 60 },
  stepIndicator: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xl,
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  stepLabel: {
    fontSize: typography.size.xs,
    color: colors.text.light,
    fontWeight: typography.weight.medium,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  content: { flex: 1 },
  stepContent: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.md,
  },
  nextBtnText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.surface,
  },
  doneBtn: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.md,
  },
  doneBtnText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.surface,
  },
});

export default StreamlinedOnboarding;
