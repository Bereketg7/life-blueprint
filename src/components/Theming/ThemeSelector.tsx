import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const THEMES = [
  { id: 'light', name: 'Light', icon: '☀️' },
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'high-contrast', name: 'High Contrast', icon: '👁️' },
  { id: 'dyslexia-friendly', name: 'Dyslexia Friendly', icon: '📖' },
  { id: 'system', name: 'System', icon: '⚙️' },
];

interface Props {
  currentTheme: string;
  onSelect: (themeId: string) => void;
}

export default function ThemeSelector({ currentTheme, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Theme</Text>
      <View style={styles.grid}>
        {THEMES.map(theme => (
          <TouchableOpacity
            key={theme.id}
            style={[styles.option, currentTheme === theme.id && styles.selected]}
            onPress={() => onSelect(theme.id)}
          >
            <Text style={styles.icon}>{theme.icon}</Text>
            <Text style={[styles.name, currentTheme === theme.id && styles.selectedText]}>{theme.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { flex: 1, minWidth: 80, alignItems: 'center', padding: 12, borderRadius: 10, backgroundColor: '#f5f5f5', borderWidth: 2, borderColor: 'transparent' },
  selected: { borderColor: '#4F86F7', backgroundColor: '#EFF5FF' },
  icon: { fontSize: 22, marginBottom: 4 },
  name: { fontSize: 11, color: '#666', textAlign: 'center' },
  selectedText: { color: '#4F86F7', fontWeight: '600' },
});
