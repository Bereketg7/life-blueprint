import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HealthPrediction } from '../../types';

interface Props { prediction: HealthPrediction }

const PredictionCard: React.FC<Props> = ({ prediction }) => (
  <View style={styles.card}>
    <Text style={styles.type}>{prediction.type.replace(/_/g, ' ').toUpperCase()}</Text>
    <Text style={styles.value}>{prediction.prediction.projectedValue}</Text>
    <Text style={styles.timeframe}>by {prediction.prediction.date} ({prediction.prediction.timeframe})</Text>
    <View style={styles.confidence}>
      <View style={[styles.bar, { width: `${prediction.confidence}%` }]} />
    </View>
    <Text style={styles.confText}>{prediction.confidence}% confidence</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#16213E', borderRadius: 16, padding: 16, marginBottom: 12 },
  type: { color: '#6C63FF', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  value: { color: '#fff', fontSize: 32, fontWeight: '700' },
  timeframe: { color: '#B0B0CC', fontSize: 12, marginBottom: 8 },
  confidence: { backgroundColor: '#2A2A4A', borderRadius: 4, height: 6, overflow: 'hidden' },
  bar: { backgroundColor: '#6C63FF', height: 6 },
  confText: { color: '#B0B0CC', fontSize: 11, marginTop: 4 },
});

export default PredictionCard;
