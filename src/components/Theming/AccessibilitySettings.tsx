import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { AccessibilitySettings as AccessibilitySettingsType } from '../../types';

interface Props {
  settings: AccessibilitySettingsType;
  onUpdate: (updates: Partial<AccessibilitySettingsType>) => void;
}

const FONT_SIZES: AccessibilitySettingsType['fontSize'][] = ['sm', 'md', 'lg', 'xl'];

export default function AccessibilitySettings({ settings, onUpdate }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Font Size</Text>
      <View style={styles.fontRow}>
        {FONT_SIZES.map(size => (
          <TouchableOpacity
            key={size}
            style={[styles.fontOption, settings.fontSize === size && styles.fontSelected]}
            onPress={() => onUpdate({ fontSize: size })}
          >
            <Text style={[
              styles.fontLabel,
              settings.fontSize === size && styles.fontSelectedText,
              size === 'xl' && { fontSize: 18 },
              size === 'lg' && { fontSize: 15 },
              size === 'sm' && { fontSize: 11 },
            ]}>
              {size.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>High Contrast</Text>
        <Switch value={settings.highContrast} onValueChange={v => onUpdate({ highContrast: v })} />
      </View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Dyslexia-Friendly Font</Text>
        <Switch value={settings.dyslexiaFont} onValueChange={v => onUpdate({ dyslexiaFont: v })} />
      </View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Haptic Feedback</Text>
        <Switch value={settings.hapticFeedback} onValueChange={v => onUpdate({ hapticFeedback: v })} />
      </View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Screen Reader Support</Text>
        <Switch value={settings.screenReaderEnabled} onValueChange={v => onUpdate({ screenReaderEnabled: v })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  fontRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  fontOption: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 8, backgroundColor: '#f5f5f5', borderWidth: 2, borderColor: 'transparent' },
  fontSelected: { borderColor: '#4F86F7', backgroundColor: '#EFF5FF' },
  fontLabel: { fontSize: 13, fontWeight: '600', color: '#444' },
  fontSelectedText: { color: '#4F86F7' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rowLabel: { fontSize: 15, color: '#333' },
});
