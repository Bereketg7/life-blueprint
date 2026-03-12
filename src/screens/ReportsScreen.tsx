import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { generateReport } from '../services/reporting';
import { HealthReport } from '../types';

export default function ReportsScreen() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [userId] = useState('current_user');

  const generate = (period: HealthReport['period']) => {
    const report = generateReport(userId, period, { activity: [], sleep: [], nutrition: [], mental: [] });
    setReports(prev => [report, ...prev]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Reports</Text>
        <Text style={styles.subtitle}>Your wellness summary</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Generate Report</Text>
        <View style={styles.buttonRow}>
          {(['weekly', 'monthly', 'quarterly'] as const).map(period => (
            <TouchableOpacity key={period} style={styles.genButton} onPress={() => generate(period)}>
              <Text style={styles.genButtonText}>{period.charAt(0).toUpperCase() + period.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Past Reports</Text>
        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>Generate your first report above</Text>
          </View>
        ) : reports.map(report => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportPeriod}>{report.period.charAt(0).toUpperCase() + report.period.slice(1)} Report</Text>
              <Text style={styles.reportDate}>{new Date(report.generatedAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.stat}><Text style={styles.statValue}>{report.summaryData.totalWorkouts}</Text><Text style={styles.statLabel}>Workouts</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>{report.summaryData.avgSleep}h</Text><Text style={styles.statLabel}>Avg Sleep</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>{report.summaryData.avgCalories}</Text><Text style={styles.statLabel}>Avg kcal</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>{report.summaryData.avgMood}/5</Text><Text style={styles.statLabel}>Avg Mood</Text></View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#FF9500', padding: 16, paddingTop: 50 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  content: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#666', marginTop: 16, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  buttonRow: { flexDirection: 'row', gap: 8 },
  genButton: { flex: 1, backgroundColor: '#FF9500', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  genButtonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#666' },
  reportCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginVertical: 5 },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  reportPeriod: { fontSize: 15, fontWeight: '600' },
  reportDate: { fontSize: 12, color: '#888' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stat: { flex: 1, minWidth: 60, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#FF9500' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
});
