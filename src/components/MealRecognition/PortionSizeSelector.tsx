import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  portions: string[];
  onSelect: (portion: string, multiplier: number) => void;
}

const PortionSizeSelector: React.FC<Props> = ({ portions, onSelect }) => {
  const [selected, setSelected] = useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Portion Size</Text>
      <View style={styles.row}>
        {portions.map((p, i) => (
          <TouchableOpacity
            key={p}
            style={[styles.option, selected === i && styles.selected]}
            onPress={() => { setSelected(i); onSelect(p, i === 0 ? 1 : i + 0.5); }}
          >
            <Text style={styles.optionText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  label: { color: '#B0B0CC', marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { backgroundColor: '#16213E', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  selected: { backgroundColor: '#6C63FF' },
  optionText: { color: '#fff', fontSize: 12 },
});

export default PortionSizeSelector;
