import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RiskAssessment } from '../../types';

interface Props { assessment: RiskAssessment }

const COLORS: Record<'low' | 'medium' | 'high', string> = {
  low: '#4CAF50', medium: '#FFC107', high: '#F44336',
};

const getRiskLevel = (score: number): 'low' | 'medium' | 'high' =>
  score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

const RiskWarning: React.FC<Props> = ({ assessment }) => {
  const level = getRiskLevel(assessment.riskScore);
  return (
    <View style={[styles.card, { borderLeftColor: COLORS[level] }]}>
      <Text style={styles.type}>{assessment.type.toUpperCase()} RISK</Text>
      <Text style={[styles.score, { color: COLORS[level] }]}>{assessment.riskScore}%</Text>
      <Text style={styles.rec}>{assessment.recommendation}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#16213E', borderRadius: 12, padding: 16, marginBottom: 8, borderLeftWidth: 4 },
  type: { color: '#B0B0CC', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  score: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  rec: { color: '#fff', fontSize: 13 },
});

export default RiskWarning;
