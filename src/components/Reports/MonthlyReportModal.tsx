import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { HealthReport } from '../../types';
import { formatMonthlyReportText } from '../../services/reports/monthlyReport';

interface Props { visible: boolean; report: HealthReport | null; onExport: () => void; onClose: () => void }

const MonthlyReportModal: React.FC<Props> = ({ visible, report, onExport, onClose }) => (
  <Modal visible={visible} animationType="slide">
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Monthly Report</Text>
        <TouchableOpacity onPress={onClose}><Text style={styles.close}>✕</Text></TouchableOpacity>
      </View>
      <ScrollView style={styles.body}>
        {report && <Text style={styles.content}>{formatMonthlyReportText(report)}</Text>}
      </ScrollView>
      <TouchableOpacity style={styles.btn} onPress={onExport}><Text style={styles.btnText}>📄 Export PDF</Text></TouchableOpacity>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, paddingTop: 48 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  close: { color: '#B0B0CC', fontSize: 18, padding: 8 },
  body: { flex: 1, padding: 16 },
  content: { color: '#B0B0CC', fontFamily: 'monospace', fontSize: 13, lineHeight: 20 },
  btn: { backgroundColor: '#6C63FF', borderRadius: 12, margin: 16, padding: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});

export default MonthlyReportModal;
