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
import { SleepLog } from '../../types';
import { colors, typography, spacing, borderRadius, shadow } from '../../styles/theme';

interface Props {
  onSave: (log: Omit<SleepLog, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  userId: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];
const MOOD_EMOJIS = ['😴', '😪', '😐', '😊', '🤩'];
const STAR_LABELS = ['Terrible', 'Poor', 'Fair', 'Good', 'Excellent'];

const fmt = (n: number) => String(n).padStart(2, '0');

/** Total minutes in a 24-hour day */
const MINUTES_PER_DAY = 1440;

const calcDuration = (bedH: number, bedM: number, wakeH: number, wakeM: number): number => {
  const bedMins = bedH * 60 + bedM;
  const wakeMins = wakeH * 60 + wakeM;
  const diff = wakeMins >= bedMins ? wakeMins - bedMins : MINUTES_PER_DAY - bedMins + wakeMins;
  return Math.round((diff / 60) * 10) / 10;
};

const buildTimeStr = (h: number, m: number): string => {
  const now = new Date();
  now.setHours(h, m, 0, 0);
  return now.toISOString();
};

const TimeSelector = ({
  label,
  hour,
  minute,
  onHourChange,
  onMinuteChange,
}: {
  label: string;
  hour: number;
  minute: number;
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
}) => (
  <View style={styles.timeBlock}>
    <Text style={styles.timeLabel}>{label}</Text>
    <View style={styles.timeRow}>
      <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
        {HOURS.map(h => (
          <TouchableOpacity key={h} style={[styles.timeItem, hour === h && styles.timeItemSelected]} onPress={() => onHourChange(h)}>
            <Text style={[styles.timeItemText, hour === h && styles.timeItemTextSelected]}>{fmt(h)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.timeSep}>:</Text>
      <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
        {MINUTES.map(m => (
          <TouchableOpacity key={m} style={[styles.timeItem, minute === m && styles.timeItemSelected]} onPress={() => onMinuteChange(m)}>
            <Text style={[styles.timeItemText, minute === m && styles.timeItemTextSelected]}>{fmt(m)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    <Text style={styles.timeDisplay}>{fmt(hour)}:{fmt(minute)}</Text>
  </View>
);

const SleepTracker = ({ onSave, onCancel, userId }: Props) => {
  const today = new Date().toISOString().split('T')[0];
  const [bedHour, setBedHour] = useState(22);
  const [bedMinute, setBedMinute] = useState(0);
  const [wakeHour, setWakeHour] = useState(6);
  const [wakeMinute, setWakeMinute] = useState(0);
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [wakeUpMood, setWakeUpMood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');

  const duration = calcDuration(bedHour, bedMinute, wakeHour, wakeMinute);

  const handleSave = () => {
    onSave({
      userId,
      date: today,
      bedtime: buildTimeStr(bedHour, bedMinute),
      wakeTime: buildTimeStr(wakeHour, wakeMinute),
      duration,
      quality,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Sleep 😴</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.durationCard}>
          <Text style={styles.durationEmoji}>🌙</Text>
          <Text style={styles.durationValue}>{duration.toFixed(1)}h</Text>
          <Text style={styles.durationLabel}>Sleep Duration</Text>
        </View>

        <View style={styles.timePickers}>
          <TimeSelector
            label="Bedtime"
            hour={bedHour}
            minute={bedMinute}
            onHourChange={setBedHour}
            onMinuteChange={setBedMinute}
          />
          <TimeSelector
            label="Wake Time"
            hour={wakeHour}
            minute={wakeMinute}
            onHourChange={setWakeHour}
            onMinuteChange={setWakeMinute}
          />
        </View>

        <Text style={styles.sectionLabel}>Sleep Quality</Text>
        <View style={styles.starsRow}>
          {([1, 2, 3, 4, 5] as const).map(n => (
            <TouchableOpacity key={n} onPress={() => setQuality(n)} style={styles.starBtn}>
              <Text style={[styles.star, quality >= n && styles.starActive]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.starLabel}>{STAR_LABELS[quality - 1]}</Text>

        <Text style={styles.sectionLabel}>Mood on Waking</Text>
        <View style={styles.moodRow}>
          {([1, 2, 3, 4, 5] as const).map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.moodBtn, wakeUpMood === n && styles.moodBtnSelected]}
              onPress={() => setWakeUpMood(n)}
            >
              <Text style={styles.moodEmoji}>{MOOD_EMOJIS[n - 1]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Dreams, disturbances, how you feel..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          placeholderTextColor={colors.text.light}
        />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Sleep Log 🌙</Text>
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
  durationCard: {
    backgroundColor: `${colors.category.sleep}15`,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  durationEmoji: { fontSize: 40, marginBottom: spacing.sm },
  durationValue: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.extrabold,
    color: colors.category.sleep,
  },
  durationLabel: { fontSize: typography.size.sm, color: colors.text.secondary },
  timePickers: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  timeBlock: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, ...shadow.sm },
  timeLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  timeRow: { flexDirection: 'row', alignItems: 'center', height: 120 },
  timeScroll: { flex: 1 },
  timeItem: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  timeItemSelected: { backgroundColor: `${colors.category.sleep}20` },
  timeItemText: { fontSize: typography.size.md, color: colors.text.secondary },
  timeItemTextSelected: { color: colors.category.sleep, fontWeight: typography.weight.bold },
  timeSep: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.light,
    marginHorizontal: spacing.xs,
  },
  timeDisplay: {
    textAlign: 'center',
    fontSize: typography.size.xl,
    fontWeight: typography.weight.extrabold,
    color: colors.category.sleep,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  starsRow: { flexDirection: 'row', gap: spacing.md, justifyContent: 'center' },
  starBtn: { padding: spacing.xs },
  star: { fontSize: 36, color: colors.disabled },
  starActive: { color: colors.warning },
  starLabel: {
    textAlign: 'center',
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  moodRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  moodBtn: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  moodBtnSelected: { borderColor: colors.category.sleep, backgroundColor: `${colors.category.sleep}20` },
  moodEmoji: { fontSize: 28 },
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
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveBtn: {
    backgroundColor: colors.category.sleep,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.md,
  },
  saveBtnText: { fontSize: typography.size.md, fontWeight: typography.weight.bold, color: colors.surface },
});

export default SleepTracker;
