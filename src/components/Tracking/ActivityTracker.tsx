import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';
import { useTracking } from '../../context/TrackingContext';

interface ActivityTrackerProps {
  onClose: () => void;
}

const ACTIVITY_TYPES = [
  { label: 'Running', emoji: '🏃' },
  { label: 'Walking', emoji: '🚶' },
  { label: 'Cycling', emoji: '🚴' },
  { label: 'Swimming', emoji: '🏊' },
  { label: 'Gym', emoji: '🏋️' },
  { label: 'Yoga', emoji: '🧘' },
  { label: 'Stretching', emoji: '🤸' },
  { label: 'HIIT', emoji: '⚡' },
];

const DURATION_OPTIONS = [15, 20, 30, 45, 60, 90];

const INTENSITY_OPTIONS: { label: string; value: 'low' | 'medium' | 'high'; color: string }[] = [
  { label: 'Low', value: 'low', color: Colors.success },
  { label: 'Medium', value: 'medium', color: Colors.warning },
  { label: 'High', value: 'high', color: Colors.secondary },
];

const ActivityTracker: React.FC<ActivityTrackerProps> = ({ onClose }) => {
  const { logActivity } = useTracking();
  const [type, setType] = React.useState('');
  const [duration, setDuration] = React.useState<number | null>(null);
  const [intensity, setIntensity] = React.useState<'low' | 'medium' | 'high'>('medium');

  const handleLog = () => {
    if (!type || !duration) return;
    const today = new Date().toISOString().split('T')[0];
    logActivity({
      userId: 'user',
      date: today,
      type,
      duration,
      intensity,
      caloriesBurned: 0,
      notes: '',
      status: 'completed',
    });
    onClose();
  };

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.label}>Activity Type</Text>
      <View style={styles.grid}>
        {ACTIVITY_TYPES.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.gridItem, type === item.label && styles.gridItemActive]}
            onPress={() => setType(item.label)}
            activeOpacity={0.8}
          >
            <Text style={styles.gridEmoji}>{item.emoji}</Text>
            <Text style={[styles.gridLabel, type === item.label && styles.gridLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { marginTop: Spacing.md }]}>Duration (minutes)</Text>
      <View style={styles.row}>
        {DURATION_OPTIONS.map((min) => (
          <TouchableOpacity
            key={min}
            style={[styles.optionBtn, duration === min && styles.optionBtnActive]}
            onPress={() => setDuration(min)}
            activeOpacity={0.8}
          >
            <Text style={[styles.optionBtnText, duration === min && styles.optionBtnTextActive]}>
              {min}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { marginTop: Spacing.md }]}>Intensity</Text>
      <View style={styles.row}>
        {INTENSITY_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.intensityBtn,
              intensity === opt.value && { borderColor: opt.color, backgroundColor: `${opt.color}22` },
            ]}
            onPress={() => setIntensity(opt.value)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.intensityBtnText,
                intensity === opt.value && { color: opt.color, fontWeight: Typography.weights.bold },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.logBtn, (!type || !duration) && styles.logBtnDisabled]}
        onPress={handleLog}
        disabled={!type || !duration}
        activeOpacity={0.8}
      >
        <Text style={styles.logBtnText}>Log Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridItem: {
    width: '22%',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.sm,
    gap: 4,
  },
  gridItemActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}22`,
  },
  gridEmoji: { fontSize: 22 },
  gridLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
  gridLabelActive: {
    color: Colors.primary,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 48,
    alignItems: 'center',
  },
  optionBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionBtnText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  optionBtnTextActive: {
    color: Colors.text.primary,
  },
  intensityBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  intensityBtnText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  logBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 4,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  logBtnDisabled: { opacity: 0.45 },
  logBtnText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
});

export default ActivityTracker;

