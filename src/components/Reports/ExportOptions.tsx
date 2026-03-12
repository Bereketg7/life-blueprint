import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props { onExportPDF: () => void; onExportCSV: () => void; onEmailReport: () => void }

const ExportOptions: React.FC<Props> = ({ onExportPDF, onExportCSV, onEmailReport }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Export Options</Text>
    <TouchableOpacity style={styles.option} onPress={onExportPDF}><Text style={styles.text}>📄 Export as PDF</Text></TouchableOpacity>
    <TouchableOpacity style={styles.option} onPress={onExportCSV}><Text style={styles.text}>📊 Export as CSV</Text></TouchableOpacity>
    <TouchableOpacity style={styles.option} onPress={onEmailReport}><Text style={styles.text}>📧 Email Report</Text></TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  option: { backgroundColor: '#16213E', borderRadius: 12, padding: 14, marginBottom: 8 },
  text: { color: '#fff', fontSize: 14 },
});

export default ExportOptions;
