import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';
import { useUser } from '../../context/UserContext';
import { usePlan } from '../../context/PlanContext';
import { UserProfile } from '../../types';
import PersonalMetrics from './PersonalMetrics';
import GoalSelection from './GoalSelection';
import HealthAssessment from './HealthAssessment';
import PreferencesForm from './PreferencesForm';

interface OnboardingFormProps {
  onComplete: () => void;
}

interface FormData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  goalType: string;
  activityLevel: string;
  dietaryPreferences: string[];
  healthConditions: string[];
  workoutNotificationsEnabled: boolean;
  mealNotificationsEnabled: boolean;
}

const STEP_TITLES = ['About You', 'Your Goal', 'Health Info', 'Preferences'];

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const { saveProfile } = useUser();
  const { generatePlan } = usePlan();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goalType: '',
    activityLevel: '',
    dietaryPreferences: [],
    healthConditions: [],
    workoutNotificationsEnabled: true,
    mealNotificationsEnabled: true,
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDietaryToggle = (pref: string) => {
    setFormData((prev) => {
      const exists = prev.dietaryPreferences.includes(pref);
      return {
        ...prev,
        dietaryPreferences: exists
          ? prev.dietaryPreferences.filter((p) => p !== pref)
          : [...prev.dietaryPreferences, pref],
      };
    });
  };

  const handleConditionToggle = (condition: string) => {
    setFormData((prev) => {
      if (condition === 'None') {
        return { ...prev, healthConditions: ['None'] };
      }
      const withoutNone = prev.healthConditions.filter((c) => c !== 'None');
      const exists = withoutNone.includes(condition);
      return {
        ...prev,
        healthConditions: exists
          ? withoutNone.filter((c) => c !== condition)
          : [...withoutNone, condition],
      };
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleComplete = () => {
    const now = new Date().toISOString();
    const profile: UserProfile = {
      id: Math.random().toString(36).slice(2, 11),
      name: formData.name || 'User',
      age: parseInt(formData.age, 10) || 25,
      gender: (formData.gender as UserProfile['gender']) || 'other',
      height: parseFloat(formData.height) || 170,
      weight: parseFloat(formData.weight) || 70,
      goalType: (formData.goalType as UserProfile['goalType']) || 'maintenance',
      activityLevel: (formData.activityLevel as UserProfile['activityLevel']) || 'sedentary',
      dietaryPreferences: formData.dietaryPreferences,
      healthConditions: formData.healthConditions,
      workoutNotificationsEnabled: formData.workoutNotificationsEnabled,
      mealNotificationsEnabled: formData.mealNotificationsEnabled,
      createdAt: now,
      updatedAt: now,
    };

    saveProfile(profile);
    generatePlan(profile);
    onComplete();
  };

  const isNextEnabled = () => {
    if (currentStep === 0) return formData.name.trim().length > 0;
    if (currentStep === 1) return formData.goalType.length > 0;
    if (currentStep === 2) return formData.activityLevel.length > 0;
    return true;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalMetrics
            data={{
              name: formData.name,
              age: formData.age,
              gender: formData.gender,
              height: formData.height,
              weight: formData.weight,
            }}
            onChange={handleFieldChange}
          />
        );
      case 1:
        return (
          <GoalSelection
            selectedGoal={formData.goalType}
            onSelect={(goal) => setFormData((prev) => ({ ...prev, goalType: goal }))}
          />
        );
      case 2:
        return (
          <HealthAssessment
            activityLevel={formData.activityLevel}
            healthConditions={formData.healthConditions}
            onActivityChange={(level) => setFormData((prev) => ({ ...prev, activityLevel: level }))}
            onConditionToggle={handleConditionToggle}
          />
        );
      case 3:
        return (
          <PreferencesForm
            dietaryPreferences={formData.dietaryPreferences}
            onDietaryToggle={handleDietaryToggle}
            workoutNotificationsEnabled={formData.workoutNotificationsEnabled}
            mealNotificationsEnabled={formData.mealNotificationsEnabled}
            onWorkoutNotificationsToggle={(enabled) =>
              setFormData((prev) => ({ ...prev, workoutNotificationsEnabled: enabled }))
            }
            onMealNotificationsToggle={(enabled) =>
              setFormData((prev) => ({ ...prev, mealNotificationsEnabled: enabled }))
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Step indicator */}
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{STEP_TITLES[currentStep]}</Text>
        <View style={styles.dots}>
          {STEP_TITLES.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentStep && styles.dotActive]} />
          ))}
        </View>
        <Text style={styles.stepCounter}>{currentStep + 1} / {STEP_TITLES.length}</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.footer}>
        {currentStep > 0 ? (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}

        <TouchableOpacity
          style={[styles.nextBtn, !isNextEnabled() && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!isNextEnabled()}
          activeOpacity={0.8}
        >
          <Text style={styles.nextBtnText}>
            {currentStep === 3 ? '🚀 Get Started' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stepHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stepTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  stepCounter: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backBtn: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  backBtnPlaceholder: {
    width: 80,
  },
  backBtnText: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    minWidth: 140,
    alignItems: 'center',
  },
  nextBtnDisabled: {
    opacity: 0.45,
  },
  nextBtnText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
});

export default OnboardingForm;
