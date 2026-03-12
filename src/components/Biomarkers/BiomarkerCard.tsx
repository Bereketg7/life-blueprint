import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Biomarker, BiomarkerTrend } from '../../types';

interface Props { biomarker: Biomarker; trend?: BiomarkerTrend }

const STATUS_COLORS: Record<Biomarker['status'], string> = {
  normal: '#4CAF50', warning: '#FFC107', alert: '#F44336',
};

const BiomarkerCard: React.FC<Props> = ({ biomarker, trend }) => (
  <View style={[styles.card, { borderLeftColor: STATUS_COLORS[biomarker.status] }]}>
    <Text style={styles.type}>{biomarker.type.replace(/_/g, ' ').toUpperCase()}</Text>
    <Text style={styles.value}>{biomarker.value}<Text style={styles.unit}> {biomarker.unit}</Text></Text>
    {trend && <Text style={styles.trend}>{trend.trend} ({trend.changePercent > 0 ? '+' : ''}{trend.changePercent}%)</Text>}
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#16213E', borderRadius: 12, padding: 16, marginBottom: 8, borderLeftWidth: 4 },
  type: { color: '#B0B0CC', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  value: { color: '#fff', fontSize: 28, fontWeight: '700' },
  unit: { fontSize: 14, color: '#B0B0CC' },
  trend: { color: '#6C63FF', fontSize: 12, marginTop: 4 },
});

export default BiomarkerCard;
