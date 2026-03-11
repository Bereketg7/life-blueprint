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
import { ActivityLog } from '../../types';
import { colors, typography, spacing, borderRadius, shadow } from '../../styles/theme';

interface Props {
  onSave: (log: Omit<ActivityLog, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  userId: string;
}

type ActivityType = ActivityLog['type'];
type Intensity = ActivityLog['intensity'];

const ACTIVITY_TYPES: { value: ActivityType; label: string; emoji: string }[] = [
  { value: 'walking', label: 'Walking', emoji: '🚶' },
  { value: 'cardio', label: 'Running', emoji: '��' },
  { value: 'cycling', label: 'Cycling', emoji: '🚴' },
  { value: 'swimming', label: 'Swimming', emoji: '🏊' },
  { value: 'strength', label: 'Gym', emoji: '🏋️' },
  { value: 'yoga', label: 'Yoga', emoji: '🧘' },
  { value: 'sports', label: 'Sports', emoji: '⚽' },
  { value: 'other', label: 'Other', emoji: '✨' },
];

const INTENSITY_OPTIONS: { value: Intensity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: colors.success },
  { value: 'moderate', label: 'Moderate', color: colors.warning },
  { value: 'high', label: 'High', color: colors.error },
];

const MET_VALUES: Record<ActivityType, Record<Intensity, number>> = {
  walking: { low: 2.5, moderate: 3.5, high: 4.5 },
  cardio: { low: 6, moderate: 8, high: 10 },
  cycling: { low: 4, moderate: 6, high: 8 },
  swimming: { low: 5, moderate: 7, high: 9 },
  strength: { low: 3, moderate: 5, high: 6 },
  yoga: { low: 2, moderate: 3, high: 4 },
  sports: { low: 4, moderate: 6, high: 8 },
  flexibility: { low: 2, moderate: 2.5, high: 3 },
  other: { low: 3, moderate: 5, high: 7 },
};

const calcCalories = (type: ActivityType, duration: number, intensity: Intensity): number => {
  const met = MET_VALUES[type]?.[intensity] ?? 5;
  const weightKg = 70;
  return Math.round((met * weightKg * duration) / 60);
};

const ActivityTracker = ({ onSave, onCancel, userId }: Props) => {
  const today = new Date().toISOString().split('T')[0];
  const [activityType, setActivityType] = useState<ActivityType>('walking');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<Intensity>('moderate');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const durationNum = parseInt(duration) || 0;
  const caloriesBurned = durationNum > 0 ? calcCalories(activityType, durationNum, intensity) : 0;
  const activityName = ACTIVITY_TYPES.find(a => a.value === activityType)?.label ?? 'Activity';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!duration || durationNum <= 0) newErrors.duration = 'Enter a valid duration';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      userId,
      date: today,
      type: activityType,
      name: activityName,
      duration: durationNum,
      intensity,
      caloriesBurned,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Activity</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionLabel}>Activity Type</Text>
        <View style={styles.typeGrid}>
          {ACTIVITY_TYPES.map(a => (
            <TouchableOpacity
              key={a.value}
              style={[styles.typeCard, activityType === a.value && styles.typeCardSelected]}
              onPress={() => setActivityType(a.value)}
            >
              <Text style={styles.typeEmoji}>{a.emoji}</Text>
              <Text style={[styles.typeLabel, activityType === a.value && styles.typeLabelSelected]}>
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Duration (minutes)</Text>
        <TextInput
          style={[styles.input, errors.duration ? styles.inputError : null]}
          placeholder="e.g. 30"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholderTextColor={colors.text.light}
        />
        {errors.duration ? <Text style={styles.errorText}>{errors.duration}</Text> : null}

        <Text style={styles.sectionLabel}>Intensity</Text>
        <View style={styles.intensityRow}>
          {INTENSITY_OPTIONS.map(i => (
            <TouchableOpacity
              key={i.value}
              style={[styles.intensityBtn, intensity === i.value && { backgroundColor: i.color, borderColor: i.color }]}
              onPress={() => setIntensity(i.value)}
            >
              <Text style={[styles.intensityLabel, intensity === i.value && styles.intensityLabelSelected]}>
                {i.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {caloriesBurned > 0 && (
          <View style={styles.calorieCard}>
            <Text style={styles.calorieEmoji}>🔥</Text>
            <View>
              <Text style={styles.calorieTitle}>Estimated Calories Burned</Text>
              <Text style={styles.calorieValue}>{caloriesBurned} kcal</Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionLabel}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="How did it feel? Any details to add?"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          placeholderTextColor={colors.text.light}
        />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Activity 💪</Text>
        </TouchableOpacity>
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
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { fontSize: typography.size.md, color: colors.text.secondary },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  sectionLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeCard: {
    width: '23%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  typeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}12`,
  },
  typeEmoji: { fontSize: 24, marginBottom: spacing.xs },
  typeLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  typeLabelSelected: { color: colors.primary, fontWeight: typography.weight.semibold },
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
  textArea: { height: 90, textAlignVertical: 'top' },
  intensityRow: { flexDirection: 'row', gap: spacing.md },
  intensityBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  intensityLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  intensityLabelSelected: { color: colors.surface },
  calorieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.warning}15`,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  calorieEmoji: { fontSize: 32 },
  calorieTitle: { fontSize: typography.size.sm, color: colors.text.secondary },
  calorieValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.warning,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.md,
  },
  saveBtnText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.surface,
  },
});

export default ActivityTracker;
