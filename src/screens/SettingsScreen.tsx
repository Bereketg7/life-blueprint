import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ThemeSelector from '../components/Theming/ThemeSelector';
import AccessibilitySettings from '../components/Theming/AccessibilitySettings';
import { AccessibilitySettings as AccessibilitySettingsType } from '../types';

interface Props {
  themeId: string;
  accessibility: AccessibilitySettingsType;
  onSwitchTheme: (id: string) => void;
  onUpdateAccessibility: (updates: Partial<AccessibilitySettingsType>) => void;
}

export default function SettingsScreen({ themeId, accessibility, onSwitchTheme, onUpdateAccessibility }: Props) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ThemeSelector currentTheme={themeId} onSelect={onSwitchTheme} />
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Accessibility</Text>
      <AccessibilitySettings settings={accessibility} onUpdate={onUpdateAccessibility} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#9B59B6', padding: 16, paddingTop: 50 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#666', marginHorizontal: 16, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
});
