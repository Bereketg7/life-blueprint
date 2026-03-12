import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BiomarkerTrend } from '../../types';

interface Props { trend: BiomarkerTrend }

const TREND_EMOJIS: Record<BiomarkerTrend['trend'], string> = {
  improving: '📈', declining: '📉', stable: '➡️',
};

const BiomarkerTrendCard: React.FC<Props> = ({ trend }) => (
  <View style={styles.card}>
    <Text style={styles.type}>{trend.type.replace(/_/g, ' ')}</Text>
    <Text style={styles.trend}>{TREND_EMOJIS[trend.trend]} {trend.trend}</Text>
    <View style={styles.weeks}>
      <Text style={styles.week}>Week 1: {trend.week1Avg.toFixed(1)}</Text>
      <Text style={styles.arrow}>→</Text>
      <Text style={styles.week}>Week 2: {trend.week2Avg.toFixed(1)}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#16213E', borderRadius: 12, padding: 12, marginBottom: 8 },
  type: { color: '#B0B0CC', fontSize: 11, textTransform: 'capitalize', marginBottom: 4 },
  trend: { color: '#fff', fontWeight: '600', marginBottom: 4 },
  weeks: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  week: { color: '#B0B0CC', fontSize: 12 },
  arrow: { color: '#6C63FF' },
});

export default BiomarkerTrendCard;
