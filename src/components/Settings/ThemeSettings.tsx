import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ALL_THEMES } from '../../context/ThemeContext';

const ThemeSettings: React.FC = () => {
  const { theme, setThemeById } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 Theme</Text>
      {ALL_THEMES.map((t) => (
        <TouchableOpacity
          key={t.id}
          style={[styles.option, theme.id === t.id && styles.selected]}
          onPress={() => setThemeById(t.id)}
        >
          <View style={[styles.preview, { backgroundColor: t.colors.primary }]} />
          <Text style={styles.name}>{t.name}</Text>
          {theme.id === t.id && <Text style={styles.check}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213E', borderRadius: 12, padding: 12, marginBottom: 8 },
  selected: { borderColor: '#6C63FF', borderWidth: 2 },
  preview: { width: 24, height: 24, borderRadius: 12, marginRight: 12 },
  name: { color: '#fff', flex: 1 },
  check: { color: '#6C63FF', fontWeight: '700' },
});

export default ThemeSettings;
