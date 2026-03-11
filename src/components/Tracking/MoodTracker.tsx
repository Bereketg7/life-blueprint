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

interface Props {
  onSubmit?: () => void;
}

const MOOD_EMOJIS: Record<number, string> = {
  1: '😞', 2: '😞', 3: '😟', 4: '😐', 5: '😐',
  6: '🙂', 7: '😊', 8: '😄', 9: '😄', 10: '😁',
};

export default function MoodTracker({ onSubmit }: Props) {
  const { logMood } = useTracking();

  const [mood, setMood] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (mood === null) {
      Alert.alert('Validation Error', 'Please select your mood level.');
      return;
    }
    if (stress === null) {
      Alert.alert('Validation Error', 'Please select your stress level.');
      return;
    }

    logMood({
      userId: 'current_user',
      date: new Date().toISOString().split('T')[0],
      mood,
      stress,
      notes,
    });

    setMood(null);
    setStress(null);
    setNotes('');

    Alert.alert('Success', 'Mood logged!');
    onSubmit?.();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Log Mood</Text>

      <Text style={styles.label}>How are you feeling? (1–10)</Text>
      <View style={styles.scaleRow}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
          <TouchableOpacity
            key={val}
            style={[styles.moodBtn, mood === val && styles.moodBtnActive]}
            onPress={() => setMood(val)}
          >
            <Text style={styles.moodEmoji}>{MOOD_EMOJIS[val]}</Text>
            <Text style={[styles.moodNum, mood === val && styles.moodNumActive]}>{val}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Stress Level (1–10)</Text>
      <View style={styles.stressRow}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
          <TouchableOpacity
            key={val}
            style={[styles.stressCircle, stress !== null && val <= stress && styles.stressCircleActive]}
            onPress={() => setStress(val)}
          >
            <Text style={[styles.stressNum, stress !== null && val <= stress && styles.stressNumActive]}>
              {val}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.stressLabels}>
        <Text style={styles.stressLabelText}>Low</Text>
        <Text style={styles.stressLabelText}>High</Text>
      </View>

      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={setNotes}
        placeholder="What's affecting your mood or stress today?"
        placeholderTextColor={Colors.text.muted}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Log Mood</Text>
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
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  moodBtn: {
    alignItems: 'center',
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 28,
  },
  moodBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodNum: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  moodNumActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  stressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  stressCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stressCircleActive: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  stressNum: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    fontWeight: Typography.weights.medium,
  },
  stressNumActive: {
    color: Colors.text.primary,
  },
  stressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  stressLabelText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.text.primary,
    fontSize: Typography.sizes.md,
    borderWidth: 1,
    borderColor: Colors.border,
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
