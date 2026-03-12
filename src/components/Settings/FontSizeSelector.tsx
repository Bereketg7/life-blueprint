import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility } from '../../hooks/useAccessibility';
import { AccessibilitySettings } from '../../types';

const SIZES: AccessibilitySettings['fontSize'][] = ['small', 'normal', 'large', 'xlarge'];
const LABELS = { small: 'A', normal: 'A', large: 'A', xlarge: 'A' };
const SIZE_MAP = { small: 12, normal: 16, large: 20, xlarge: 24 };

const FontSizeSelector: React.FC = () => {
  const { fontSize, setFontSize } = useAccessibility();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Font Size</Text>
      <View style={styles.row}>
        {SIZES.map((size) => (
          <TouchableOpacity
            key={size}
            style={[styles.option, fontSize === size && styles.selected]}
            onPress={() => setFontSize(size)}
          >
            <Text style={[styles.label, { fontSize: SIZE_MAP[size] }, fontSize === size && styles.selectedText]}>{LABELS[size]}</Text>
            <Text style={styles.sizeName}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: '#fff', fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8 },
  option: { flex: 1, backgroundColor: '#16213E', borderRadius: 12, padding: 12, alignItems: 'center' },
  selected: { backgroundColor: '#6C63FF' },
  label: { color: '#fff', fontWeight: '700' },
  selectedText: { color: '#fff' },
  sizeName: { color: '#B0B0CC', fontSize: 10, marginTop: 4, textTransform: 'capitalize' },
});

export default FontSizeSelector;
