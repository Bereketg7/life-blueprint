import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useHealthcareSync } from '../hooks/useHealthcareSync';

export default function HealthcareScreen() {
  const [userId] = useState('current_user');
  const { doctorShares, labResults, prescriptions, abnormalResults, shareWithDoctor, addLabResult, addNewPrescription } = useHealthcareSync(userId);
  const [activeTab, setActiveTab] = useState<'labs' | 'prescriptions' | 'doctors'>('labs');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Healthcare</Text>
        <Text style={styles.subtitle}>Your health data, securely shared</Text>
      </View>

      {abnormalResults.length > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>⚠️ {abnormalResults.length} abnormal lab result{abnormalResults.length > 1 ? 's' : ''}</Text>
        </View>
      )}

      <View style={styles.tabs}>
        {(['labs', 'prescriptions', 'doctors'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'labs' && (
          <View>
            {labResults.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🧪</Text>
                <Text style={styles.emptyText}>No lab results yet</Text>
                <TouchableOpacity style={styles.actionButton}
                  onPress={() => addLabResult('Blood Glucose', 95, 'mg/dL', new Date().toISOString().split('T')[0], 'LabCorp', '70-99')}>
                  <Text style={styles.actionButtonText}>+ Add Lab Result</Text>
                </TouchableOpacity>
              </View>
            ) : labResults.map(r => (
              <View key={r.id} style={[styles.card, r.isAbnormal && styles.abnormalCard]}>
                <Text style={styles.cardTitle}>{r.testName}</Text>
                <Text style={styles.cardValue}>{r.value} {r.unit}</Text>
                <Text style={styles.cardSub}>{r.provider} • {r.date}</Text>
                {r.isAbnormal && <Text style={styles.abnormalTag}>⚠️ Abnormal</Text>}
              </View>
            ))}
          </View>
        )}
        {activeTab === 'prescriptions' && (
          <View>
            {prescriptions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💊</Text>
                <Text style={styles.emptyText}>No prescriptions</Text>
                <TouchableOpacity style={styles.actionButton}
                  onPress={() => addNewPrescription('Vitamin D', '2000 IU', 'Once daily', new Date().toISOString().split('T')[0])}>
                  <Text style={styles.actionButtonText}>+ Add Prescription</Text>
                </TouchableOpacity>
              </View>
            ) : prescriptions.map(p => (
              <View key={p.id} style={styles.card}>
                <Text style={styles.cardTitle}>{p.medicationName}</Text>
                <Text style={styles.cardSub}>{p.dosage} • {p.frequency}</Text>
                {p.reminderEnabled && <Text style={styles.reminder}>🔔 Reminders: {p.reminderTimes?.join(', ')}</Text>}
              </View>
            ))}
          </View>
        )}
        {activeTab === 'doctors' && (
          <View>
            {doctorShares.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>👨‍⚕️</Text>
                <Text style={styles.emptyText}>No doctor shares</Text>
                <TouchableOpacity style={styles.actionButton}
                  onPress={() => shareWithDoctor('doc_1', 'Dr. Smith', ['activity', 'nutrition', 'sleep'])}>
                  <Text style={styles.actionButtonText}>+ Share with Doctor</Text>
                </TouchableOpacity>
              </View>
            ) : doctorShares.map(s => (
              <View key={s.id} style={styles.card}>
                <Text style={styles.cardTitle}>{s.doctorName}</Text>
                <Text style={styles.cardSub}>Permissions: {s.permissions.join(', ')}</Text>
                {s.expiresAt && <Text style={styles.expiry}>Expires: {new Date(s.expiresAt).toLocaleDateString()}</Text>}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#34C759', padding: 16, paddingTop: 50 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  alertBanner: { backgroundColor: '#FFF3E0', padding: 10, borderLeftWidth: 4, borderLeftColor: '#FF9500' },
  alertText: { color: '#E65100', fontSize: 13, fontWeight: '600' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#34C759' },
  tabText: { fontSize: 14, color: '#666' },
  activeTabText: { color: '#34C759', fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginVertical: 5, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  abnormalCard: { borderLeftWidth: 4, borderLeftColor: '#F44336' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111' },
  cardValue: { fontSize: 20, fontWeight: '700', color: '#333', marginTop: 2 },
  cardSub: { fontSize: 12, color: '#888', marginTop: 4 },
  abnormalTag: { fontSize: 12, color: '#F44336', marginTop: 4 },
  reminder: { fontSize: 12, color: '#4F86F7', marginTop: 4 },
  expiry: { fontSize: 12, color: '#FF9500', marginTop: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 16 },
  actionButton: { backgroundColor: '#34C759', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  actionButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
