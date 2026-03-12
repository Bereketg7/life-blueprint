import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Biomarker, BiomarkerTrend } from '../../types';
import BiomarkerCard from './BiomarkerCard';
import BiomarkerAlert from './BiomarkerAlert';

interface Props { readings: Record<string, Biomarker>; alerts: Biomarker[]; trends: BiomarkerTrend[] }

const BiomarkerDashboard: React.FC<Props> = ({ readings, alerts, trends }) => (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>🔬 Biomarkers</Text>
    {alerts.map((a) => <BiomarkerAlert key={a.id} biomarker={a} />)}
    {Object.values(readings).map((b) => {
      const trend = trends.find((t) => t.type === b.type);
      return <BiomarkerCard key={b.id} biomarker={b} trend={trend} />;
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A', padding: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 16 },
});

export default BiomarkerDashboard;
