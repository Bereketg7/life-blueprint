import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const NutritionPreview: React.FC<Props> = ({ calories, protein, carbs, fat }) => (
  <View style={styles.card}>
    <Text style={styles.calories}>{calories} kcal</Text>
    <View style={styles.macroRow}>
      <View style={styles.macroItem}><Text style={styles.value}>{protein}g</Text><Text style={styles.label}>Protein</Text></View>
      <View style={styles.macroItem}><Text style={styles.value}>{carbs}g</Text><Text style={styles.label}>Carbs</Text></View>
      <View style={styles.macroItem}><Text style={styles.value}>{fat}g</Text><Text style={styles.label}>Fat</Text></View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#16213E', borderRadius: 12, padding: 16 },
  calories: { color: '#6C63FF', fontSize: 28, fontWeight: '700', textAlign: 'center' },
  macroRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  macroItem: { alignItems: 'center' },
  value: { color: '#fff', fontSize: 18, fontWeight: '600' },
  label: { color: '#B0B0CC', fontSize: 12 },
});

export default NutritionPreview;
