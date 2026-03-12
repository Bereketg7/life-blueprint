import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BiomarkerTrend } from '../../types';

const TREND_ICONS = { improving: '📈', declining: '📉', stable: '➡️' };
const TREND_COLORS = { improving: '#4CAF50', declining: '#F44336', stable: '#9E9E9E' };

interface Props {
  trend: BiomarkerTrend;
}

export default function BiomarkerCard({ trend }: Props) {
  const latestValue = trend.current;
  const hasAlerts = trend.alerts.length > 0;

  return (
    <View style={[styles.card, hasAlerts && styles.alertCard]}>
      <View style={styles.header}>
        <Text style={styles.type}>{trend.type.replace(/_/g, ' ').toUpperCase()}</Text>
        <Text style={[styles.trend, { color: TREND_COLORS[trend.trend] }]}>
          {TREND_ICONS[trend.trend]} {trend.trend}
        </Text>
      </View>
      <Text style={styles.value}>
        {latestValue.toFixed(1)} <Text style={styles.unit}>{trend.readings[0]?.unit ?? ''}</Text>
      </Text>
      <Text style={styles.baseline}>Baseline: {trend.baseline.toFixed(1)}</Text>
      {trend.alerts.map((alert, i) => (
        <View key={i} style={styles.alertRow}>
          <Text style={styles.alertText}>⚠️ {alert}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginVertical: 5, borderLeftWidth: 4, borderLeftColor: '#4F86F7' },
  alertCard: { borderLeftColor: '#F44336' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  type: { fontSize: 11, fontWeight: '700', color: '#666', letterSpacing: 0.5 },
  trend: { fontSize: 13, fontWeight: '600' },
  value: { fontSize: 28, fontWeight: '800', color: '#111' },
  unit: { fontSize: 14, color: '#888', fontWeight: '400' },
  baseline: { fontSize: 12, color: '#999', marginTop: 2 },
  alertRow: { marginTop: 6, backgroundColor: '#FFF3E0', borderRadius: 6, padding: 6 },
  alertText: { fontSize: 12, color: '#E65100' },
});
