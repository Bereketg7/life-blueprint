import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { activityCount: number; avgSleep: number; avgCalories: number; weight?: number }

const HealthSummary: React.FC<Props> = ({ activityCount, avgSleep, avgCalories, weight }) => (
  <View style={styles.card}>
    <Text style={styles.title}>📊 Health Summary</Text>
    <View style={styles.grid}>
      <View style={styles.item}><Text style={styles.value}>{activityCount}</Text><Text style={styles.label}>Sessions</Text></View>
      <View style={styles.item}><Text style={styles.value}>{avgSleep}h</Text><Text style={styles.label}>Avg Sleep</Text></View>
      <View style={styles.item}><Text style={styles.value}>{avgCalories}</Text><Text style={styles.label}>Avg Calories</Text></View>
      {weight && <View style={styles.item}><Text style={styles.value}>{weight}kg</Text><Text style={styles.label}>Weight</Text></View>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#16213E', borderRadius: 16, padding: 16, margin: 16 },
  title: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  item: { width: '50%', alignItems: 'center', paddingVertical: 8 },
  value: { color: '#fff', fontSize: 24, fontWeight: '700' },
  label: { color: '#B0B0CC', fontSize: 12 },
});

export default HealthSummary;
