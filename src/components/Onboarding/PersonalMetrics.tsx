import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';

interface PersonalMetricsProps {
  data: { name: string; age: string; gender: string; height: string; weight: string };
  onChange: (field: string, value: string) => void;
}

const GENDERS = ['Male', 'Female', 'Other'];

const PersonalMetrics: React.FC<PersonalMetricsProps> = ({ data, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Personal Information</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={data.name}
          onChangeText={(v) => onChange('name', v)}
          placeholder="Enter your name"
          placeholderTextColor={Colors.text.muted}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={data.age}
          onChangeText={(v) => onChange('age', v)}
          placeholder="Years"
          placeholderTextColor={Colors.text.muted}
          keyboardType="numeric"
          maxLength={3}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {GENDERS.map((g) => {
            const val = g.toLowerCase();
            const active = data.gender === val;
            return (
              <TouchableOpacity
                key={g}
                style={[styles.genderBtn, active && styles.genderBtnActive]}
                onPress={() => onChange('gender', val)}
                activeOpacity={0.8}
              >
                <Text style={[styles.genderText, active && styles.genderTextActive]}>{g}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.field, styles.halfField]}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={data.height}
            onChangeText={(v) => onChange('height', v)}
            placeholder="cm"
            placeholderTextColor={Colors.text.muted}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
        <View style={[styles.field, styles.halfField]}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={data.weight}
            onChangeText={(v) => onChange('weight', v)}
            placeholder="kg"
            placeholderTextColor={Colors.text.muted}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  field: {
    marginBottom: Spacing.md,
  },
  halfField: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    minHeight: 48,
  },
  genderRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  genderBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}22`,
  },
  genderText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  genderTextActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
});

export default PersonalMetrics;
