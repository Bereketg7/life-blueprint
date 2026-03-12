import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Biomarker } from '../../types';

interface Props { biomarker: Biomarker }

const BiomarkerAlert: React.FC<Props> = ({ biomarker }) => (
  <View style={[styles.alert, biomarker.status === 'alert' ? styles.alertRed : styles.alertYellow]}>
    <Text style={styles.icon}>{biomarker.status === 'alert' ? '🚨' : '⚠️'}</Text>
    <View>
      <Text style={styles.type}>{biomarker.type.replace(/_/g, ' ').toUpperCase()}</Text>
      <Text style={styles.value}>{biomarker.value} {biomarker.unit} – {biomarker.status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  alert: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, marginBottom: 8, gap: 12 },
  alertRed: { backgroundColor: '#3D0D0D' },
  alertYellow: { backgroundColor: '#3D2F0D' },
  icon: { fontSize: 24 },
  type: { color: '#fff', fontWeight: '700', fontSize: 12 },
  value: { color: '#B0B0CC', fontSize: 12 },
});

export default BiomarkerAlert;
