import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HealthReport } from '../../types';

interface Props { report: HealthReport }

const ReportPreview: React.FC<Props> = ({ report }) => (
  <View style={styles.container}>
    <Text style={styles.type}>{report.type.toUpperCase()} REPORT</Text>
    <Text style={styles.period}>{report.period.start} → {report.period.end}</Text>
    <View style={styles.metrics}>
      <View style={styles.metric}><Text style={styles.val}>{report.metrics.totalActivity}</Text><Text style={styles.label}>Workouts</Text></View>
      <View style={styles.metric}><Text style={styles.val}>{report.metrics.avgSleep}h</Text><Text style={styles.label}>Avg Sleep</Text></View>
      <View style={styles.metric}><Text style={styles.val}>{report.metrics.avgMood}/10</Text><Text style={styles.label}>Avg Mood</Text></View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#16213E', borderRadius: 16, padding: 16 },
  type: { color: '#6C63FF', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  period: { color: '#B0B0CC', fontSize: 12, marginBottom: 12 },
  metrics: { flexDirection: 'row', justifyContent: 'space-around' },
  metric: { alignItems: 'center' },
  val: { color: '#fff', fontSize: 22, fontWeight: '700' },
  label: { color: '#B0B0CC', fontSize: 11 },
});

export default ReportPreview;
