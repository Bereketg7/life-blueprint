import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DataPoint { date: string; value: number }
interface Props { metric: string; dataPoints: DataPoint[]; projectedValues?: DataPoint[] }

const TrajectoryChart: React.FC<Props> = ({ metric, dataPoints, projectedValues = [] }) => {
  const all = [...dataPoints, ...projectedValues];
  const maxVal = Math.max(...all.map((p) => p.value), 1);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{metric}</Text>
      <View style={styles.chart}>
        {dataPoints.slice(-7).map((point, i) => (
          <View key={i} style={styles.barContainer}>
            <View style={[styles.bar, { height: Math.round((point.value / maxVal) * 80) }]} />
            <Text style={styles.date}>{point.date.slice(5)}</Text>
          </View>
        ))}
        {projectedValues.slice(0, 3).map((point, i) => (
          <View key={`p${i}`} style={styles.barContainer}>
            <View style={[styles.bar, styles.projected, { height: Math.round((point.value / maxVal) * 80) }]} />
            <Text style={styles.date}>{point.date.slice(5)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#16213E', borderRadius: 16, padding: 16, marginBottom: 12 },
  title: { color: '#fff', fontWeight: '700', marginBottom: 12 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 4 },
  barContainer: { flex: 1, alignItems: 'center' },
  bar: { width: '70%', backgroundColor: '#6C63FF', borderRadius: 4 },
  projected: { backgroundColor: '#9C88FF', opacity: 0.6 },
  date: { color: '#6B6B8A', fontSize: 8, marginTop: 4 },
});

export default TrajectoryChart;
