import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useAccessibility } from '../../hooks/useAccessibility';

const AccessibilitySettings: React.FC = () => {
  const { highContrast, dyslexiaFont, hapticFeedback, screenReaderEnabled, toggleHighContrast, toggleDyslexiaFont, toggleHapticFeedback } = useAccessibility();
  const row = (label: string, value: boolean, toggle: () => void) => (
    <View style={styles.row} key={label}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={toggle} trackColor={{ true: '#6C63FF' }} />
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>♿ Accessibility</Text>
      {row('High Contrast', highContrast, toggleHighContrast)}
      {row('Dyslexia-Friendly Font', dyslexiaFont, toggleDyslexiaFont)}
      {row('Haptic Feedback', hapticFeedback, toggleHapticFeedback)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomColor: '#2A2A4A', borderBottomWidth: 1 },
  label: { color: '#fff', fontSize: 14 },
});

export default AccessibilitySettings;
