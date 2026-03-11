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
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';

interface Props {
  onSubmit?: () => void;
}

const COMMON_SYMPTOMS = [
  'Fatigue',
  'Headache',
  'Muscle Soreness',
  'Joint Pain',
  'Dizziness',
  'Nausea',
  'Shortness of Breath',
  'Insomnia',
  'Anxiety',
  'Brain Fog',
];

export default function SymptomLogger({ onSubmit }: Props) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    if (selectedSymptoms.length === 0 && notes.trim() === '') {
      Alert.alert('Validation Error', 'Please select at least one symptom or add a note.');
      return;
    }

    console.log('Symptoms logged:', selectedSymptoms);

    setSelectedSymptoms([]);
    setNotes('');

    Alert.alert('Success', 'Symptoms logged!');
    onSubmit?.();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Log Symptoms</Text>
      <Text style={styles.subtitle}>Select all that apply today</Text>

      <View style={styles.symptomsGrid}>
        {COMMON_SYMPTOMS.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom);
          return (
            <TouchableOpacity
              key={symptom}
              style={[styles.symptomChip, isSelected && styles.symptomChipActive]}
              onPress={() => toggleSymptom(symptom)}
            >
              <Text style={[styles.symptomText, isSelected && styles.symptomTextActive]}>
                {isSelected ? '✓ ' : ''}{symptom}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Additional Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Describe your symptoms in more detail..."
        placeholderTextColor={Colors.text.muted}
        multiline
        numberOfLines={4}
      />

      {selectedSymptoms.length > 0 && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>
            {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} selected
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Log Symptoms</Text>
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
    marginBottom: Spacing.lg,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  symptomChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  symptomChipActive: {
    backgroundColor: Colors.primary + '33',
    borderColor: Colors.primary,
  },
  symptomText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  symptomTextActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
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
    height: 100,
    textAlignVertical: 'top',
  },
  selectedBadge: {
    backgroundColor: Colors.primary + '22',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  selectedBadgeText: {
    color: Colors.primary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
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
