import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import type { Prescription } from '../../services/healthcare/prescriptionTracker';

interface Props { prescriptions: Prescription[]; onLogDose: (id: string) => void }

const PrescriptionTracker: React.FC<Props> = ({ prescriptions, onLogDose }) => (
  <View>
    <Text style={styles.title}>💊 Prescriptions</Text>
    <FlatList
      data={prescriptions}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.med}>{item.medicationName}</Text>
            <Text style={styles.dosage}>{item.dosage} – {item.frequency}</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={() => onLogDose(item.id)}>
            <Text style={styles.btnText}>Log Dose</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No active prescriptions.</Text>}
    />
  </View>
);

const styles = StyleSheet.create({
  title: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213E', borderRadius: 12, padding: 12, marginBottom: 6 },
  info: { flex: 1 },
  med: { color: '#fff', fontWeight: '600' },
  dosage: { color: '#B0B0CC', fontSize: 12 },
  btn: { backgroundColor: '#6C63FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  empty: { color: '#B0B0CC', textAlign: 'center', padding: 24 },
});

export default PrescriptionTracker;
