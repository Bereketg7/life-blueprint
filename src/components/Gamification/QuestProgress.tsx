import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { completed: number; total: number }

const QuestProgress: React.FC<Props> = ({ completed, total }) => (
  <View style={styles.container}>
    <Text style={styles.label}>Daily Progress</Text>
    <View style={styles.bar}>
      <View style={[styles.fill, { width: total > 0 ? `${(completed / total) * 100}%` : '0%' }]} />
    </View>
    <Text style={styles.count}>{completed}/{total} quests</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { color: '#B0B0CC', marginBottom: 8 },
  bar: { backgroundColor: '#2A2A4A', borderRadius: 8, height: 8, overflow: 'hidden' },
  fill: { backgroundColor: '#6C63FF', height: 8 },
  count: { color: '#fff', marginTop: 4, fontWeight: '600' },
});

export default QuestProgress;
