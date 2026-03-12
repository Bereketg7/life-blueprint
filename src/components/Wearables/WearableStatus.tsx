import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WearableDevice } from '../../types';

interface Props { device: WearableDevice }

const statusColors: Record<WearableDevice['status'], string> = {
  connected: '#4CAF50',
  disconnected: '#B0B0CC',
  error: '#F44336',
};

const WearableStatus: React.FC<Props> = ({ device }) => (
  <View style={styles.row}>
    <View style={[styles.dot, { backgroundColor: statusColors[device.status] }]} />
    <Text style={styles.name}>{device.name}</Text>
    <Text style={styles.status}>{device.status}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  name: { color: '#fff', flex: 1, fontSize: 14 },
  status: { color: '#B0B0CC', fontSize: 12, textTransform: 'capitalize' },
});

export default WearableStatus;
