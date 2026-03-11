import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';
import { useTracking } from '../../context/TrackingContext';

interface ActivityTrackerProps {
  onClose: () => void;
}

const ActivityTracker: React.FC<ActivityTrackerProps> = ({ onClose }) => {
  const { logActivity } = useTracking();
  const [type, setType] = React.useState('');
  const [duration, setDuration] = React.useState('');

  const handleLog = () => {
    if (!type || !duration) return;
    const today = new Date().toISOString().split('T')[0];
    logActivity({
      userId: 'user',
      date: today,
      type,
      duration: parseInt(duration, 10) || 0,
      intensity: 'medium',
      caloriesBurned: 0,
      notes: '',
      status: 'completed',
    });
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Activity Type</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="e.g. Running, Yoga"
        placeholderTextColor={Colors.text.muted}
      />
      <Text style={styles.label}>Duration (minutes)</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        placeholder="30"
        placeholderTextColor={Colors.text.muted}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[styles.logBtn, (!type || !duration) && styles.logBtnDisabled]}
        onPress={handleLog}
        disabled={!type || !duration}
        activeOpacity={0.8}
      >
        <Text style={styles.logBtnText}>Log Activity</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    minHeight: 44,
  },
  logBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 4,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  logBtnDisabled: { opacity: 0.45 },
  logBtnText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
});

export default ActivityTracker;
