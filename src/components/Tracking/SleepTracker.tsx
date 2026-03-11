import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTracking } from '../../context/TrackingContext';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';
import { SleepLog } from '../../types';

interface Props {
  onSubmit?: () => void;
}

const HOUR_OPTIONS = [4, 5, 6, 7, 8, 9, 10];

export default function SleepTracker({ onSubmit }: Props) {
  const { logSleep } = useTracking();

  const [selectedHours, setSelectedHours] = useState<number | null>(null);
  const [customHours, setCustomHours] = useState('');
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const hoursValue = selectedHours ?? parseFloat(customHours);

    if (isNaN(hoursValue) || hoursValue <= 0 || hoursValue > 24) {
      Alert.alert('Validation Error', 'Please select or enter a valid hours slept (1-24).');
      return;
    }
    if (quality === null) {
      Alert.alert('Validation Error', 'Please rate your sleep quality.');
      return;
    }

    logSleep({
      userId: 'current_user',
      date: new Date().toISOString().split('T')[0],
      hoursSlept: hoursValue,
      quality,
      notes,
    } as Omit<SleepLog, 'id' | 'createdAt'>);

    setSelectedHours(null);
    setCustomHours('');
    setQuality(null);
    setNotes('');

    Alert.alert('Success', 'Sleep logged!');
    onSubmit?.();
  };

  const STAR_LABELS = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Log Sleep</Text>

      <Text style={styles.label}>Hours Slept</Text>
      <View style={styles.hoursRow}>
        {HOUR_OPTIONS.map((h) => (
          <TouchableOpacity
            key={h}
            style={[styles.hourBtn, selectedHours === h && styles.hourBtnActive]}
            onPress={() => {
              setSelectedHours(h);
              setCustomHours('');
            }}
          >
            <Text style={[styles.hourBtnText, selectedHours === h && styles.hourBtnTextActive]}>
              {h}h
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        value={customHours}
        onChangeText={(v) => {
          setCustomHours(v);
          setSelectedHours(null);
        }}
        placeholder="Or enter custom hours (e.g. 7.5)"
        placeholderTextColor={Colors.text.muted}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Sleep Quality</Text>
      <View style={styles.starsRow}>
        {([1, 2, 3, 4, 5] as const).map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.starBtn}
            onPress={() => setQuality(star)}
          >
            <Text style={[styles.starText, quality !== null && star <= quality && styles.starActive]}>
              ★
            </Text>
            <Text style={styles.starLabel}>{STAR_LABELS[star - 1]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={setNotes}
        placeholder="How did you sleep? Any disturbances?"
        placeholderTextColor={Colors.text.muted}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Log Sleep</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  hoursRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  hourBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 48,
    alignItems: 'center',
  },
  hourBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hourBtnText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  hourBtnTextActive: {
    color: Colors.text.primary,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.text.primary,
    fontSize: Typography.sizes.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  starBtn: {
    alignItems: 'center',
    flex: 1,
  },
  starText: {
    fontSize: 28,
    color: Colors.border,
  },
  starActive: {
    color: Colors.warning,
  },
  starLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  submitBtnText: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
});
