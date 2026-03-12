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
import { MentalHealthLog } from '../../types';
import { colors, typography, spacing, borderRadius, shadow } from '../../styles/theme';

interface Props {
  onSave: (log: Omit<MentalHealthLog, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  userId: string;
}

const MOOD_OPTIONS = [
  { value: 1 as const, emoji: '😞', label: 'Very Bad' },
  { value: 2 as const, emoji: '😐', label: 'Bad' },
  { value: 3 as const, emoji: '🙂', label: 'Okay' },
  { value: 4 as const, emoji: '😊', label: 'Good' },
  { value: 5 as const, emoji: '🤩', label: 'Great' },
];

type ScaleValue = 1 | 2 | 3 | 4 | 5;

const ScaleSelector = ({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
  activeColor,
}: {
  label: string;
  value: ScaleValue;
  onChange: (v: ScaleValue) => void;
  lowLabel: string;
  highLabel: string;
  activeColor: string;
}) => (
  <View style={styles.scaleGroup}>
    <Text style={styles.sectionLabel}>{label}</Text>
    <View style={styles.scaleRow}>
      {([1, 2, 3, 4, 5] as ScaleValue[]).map(n => (
        <TouchableOpacity
          key={n}
          style={[styles.scaleBtn, value === n && { backgroundColor: activeColor, borderColor: activeColor }]}
          onPress={() => onChange(n)}
        >
          <Text style={[styles.scaleBtnText, value === n && styles.scaleBtnTextSelected]}>{n}</Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.scaleLegend}>
      <Text style={styles.scaleLegendText}>{lowLabel}</Text>
      <Text style={styles.scaleLegendText}>{highLabel}</Text>
    </View>
  </View>
);

const MoodTracker = ({ onSave, onCancel, userId }: Props) => {
  const today = new Date().toISOString().split('T')[0];
  const [mood, setMood] = useState<ScaleValue>(3);
  const [stressLevel, setStressLevel] = useState<ScaleValue>(3);
  const [energyLevel, setEnergyLevel] = useState<ScaleValue>(3);
  const [meditationMinutes, setMeditationMinutes] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [gratitude, setGratitude] = useState('');

  const handleSave = () => {
    onSave({
      userId,
      date: today,
      mood,
      stressLevel,
      anxietyLevel: stressLevel,
      energyLevel,
      meditationMinutes: parseInt(meditationMinutes) || undefined,
      journalEntry: journalEntry.trim() || undefined,
      gratitude: gratitude.trim() || undefined,
    });
  };

  const selectedMood = MOOD_OPTIONS.find(m => m.value === mood)!;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Mood 🧠</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Mood selector */}
        <Text style={styles.sectionLabel}>How are you feeling?</Text>
        <View style={styles.moodSelectorRow}>
          {MOOD_OPTIONS.map(m => (
            <TouchableOpacity
              key={m.value}
              style={[styles.moodOption, mood === m.value && styles.moodOptionSelected]}
              onPress={() => setMood(m.value)}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, mood === m.value && styles.moodLabelSelected]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.selectedMoodBadge}>
          <Text style={styles.selectedMoodText}>
            {selectedMood.emoji} You're feeling {selectedMood.label.toLowerCase()} today
          </Text>
        </View>

        <ScaleSelector
          label="Stress Level"
          value={stressLevel}
          onChange={setStressLevel}
          lowLabel="Very Low"
          highLabel="Very High"
          activeColor={colors.error}
        />

        <ScaleSelector
          label="Energy Level"
          value={energyLevel}
          onChange={setEnergyLevel}
          lowLabel="Exhausted"
          highLabel="Energized"
          activeColor={colors.warning}
        />

        <Text style={styles.sectionLabel}>Meditation (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 10"
          value={meditationMinutes}
          onChangeText={setMeditationMinutes}
          keyboardType="numeric"
          placeholderTextColor={colors.text.light}
        />

        <Text style={styles.sectionLabel}>Journal Entry</Text>
        <TextInput
          style={[styles.input, styles.textAreaLarge]}
          placeholder="What's on your mind today? How did your day go?"
          value={journalEntry}
          onChangeText={setJournalEntry}
          multiline
          numberOfLines={5}
          placeholderTextColor={colors.text.light}
        />

        <Text style={styles.sectionLabel}>Gratitude 🙏</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What are you grateful for today?"
          value={gratitude}
          onChangeText={setGratitude}
          multiline
          numberOfLines={3}
          placeholderTextColor={colors.text.light}
        />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Mood Log 🧘</Text>
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
  moodSelectorRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodOption: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flex: 1,
    marginHorizontal: 2,
  },
  moodOptionSelected: {
    borderColor: colors.secondary,
    backgroundColor: `${colors.secondary}15`,
  },
  moodEmoji: { fontSize: 28, marginBottom: spacing.xs },
  moodLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  moodLabelSelected: { color: colors.secondary, fontWeight: typography.weight.semibold },
  selectedMoodBadge: {
    backgroundColor: `${colors.secondary}15`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  selectedMoodText: {
    fontSize: typography.size.sm,
    color: colors.secondary,
    fontWeight: typography.weight.semibold,
  },
  scaleGroup: { marginTop: spacing.lg },
  scaleRow: { flexDirection: 'row', gap: spacing.sm },
  scaleBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  scaleBtnText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.secondary,
  },
  scaleBtnTextSelected: { color: colors.surface },
  scaleLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  scaleLegendText: { fontSize: typography.size.xs, color: colors.text.light },
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
  textArea: { height: 90, textAlignVertical: 'top' },
  textAreaLarge: { height: 130, textAlignVertical: 'top' },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveBtn: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.md,
  },
  saveBtnText: { fontSize: typography.size.md, fontWeight: typography.weight.bold, color: colors.surface },
});

export default MoodTracker;
