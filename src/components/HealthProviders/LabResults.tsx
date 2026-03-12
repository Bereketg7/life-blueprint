import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { LabResult } from '../../types';

interface Props { results: LabResult[] }

const statusColors: Record<LabResult['status'], string> = { normal: '#4CAF50', low: '#FFC107', high: '#FF6B6B' };

const LabResults: React.FC<Props> = ({ results }) => (
  <View>
    <Text style={styles.title}>🧪 Lab Results</Text>
    <FlatList
      data={results}
      keyExtractor={(r) => r.id}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.test}>{item.testName}</Text>
          <Text style={[styles.value, { color: statusColors[item.status] }]}>{item.value} {item.unit}</Text>
          <Text style={styles.ref}>{item.referenceRange.min}-{item.referenceRange.max}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No lab results yet.</Text>}
    />
  </View>
);

const styles = StyleSheet.create({
  title: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213E', borderRadius: 12, padding: 12, marginBottom: 6 },
  test: { flex: 1, color: '#fff', fontSize: 13 },
  value: { fontWeight: '700', marginRight: 8 },
  ref: { color: '#6B6B8A', fontSize: 11 },
  empty: { color: '#B0B0CC', textAlign: 'center', padding: 24 },
});

export default LabResults;
