import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';

interface PreferencesFormProps {
  dietaryPreferences: string[];
  onDietaryToggle: (pref: string) => void;
  notificationsEnabled: boolean;
  onNotificationsToggle: (enabled: boolean) => void;
}

const DIET_OPTIONS = ['None', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free'];

interface ToggleRowProps {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, enabled, onToggle }) => (
  <View style={toggleStyles.row}>
    <Text style={toggleStyles.label}>{label}</Text>
    <TouchableOpacity
      style={[toggleStyles.track, enabled && toggleStyles.trackActive]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={[toggleStyles.thumb, enabled && toggleStyles.thumbActive]} />
    </TouchableOpacity>
  </View>
);

const toggleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    flex: 1,
  },
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    padding: 3,
  },
  trackActive: {
    backgroundColor: Colors.primary,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.text.muted,
  },
  thumbActive: {
    backgroundColor: Colors.text.primary,
    alignSelf: 'flex-end',
  },
});

const PreferencesForm: React.FC<PreferencesFormProps> = ({
  dietaryPreferences,
  onDietaryToggle,
  notificationsEnabled,
  onNotificationsToggle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Preferences</Text>

      <Text style={styles.groupLabel}>Dietary Preferences</Text>
      <Text style={styles.hint}>Select all that apply</Text>
      <View style={styles.chipWrap}>
        {DIET_OPTIONS.map((pref) => {
          const active = dietaryPreferences.includes(pref);
          return (
            <TouchableOpacity
              key={pref}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onDietaryToggle(pref)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{pref}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.groupLabel, { marginTop: Spacing.lg }]}>Notifications</Text>
      <View style={styles.togglesCard}>
        <ToggleRow
          label="Daily workout reminders"
          enabled={notificationsEnabled}
          onToggle={() => onNotificationsToggle(!notificationsEnabled)}
        />
        <ToggleRow
          label="Meal reminders"
          enabled={notificationsEnabled}
          onToggle={() => onNotificationsToggle(!notificationsEnabled)}
        />
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
  groupLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  hint: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.round,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}22`,
  },
  chipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  chipTextActive: {
    color: Colors.primary,
  },
  togglesCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
});

export default PreferencesForm;
