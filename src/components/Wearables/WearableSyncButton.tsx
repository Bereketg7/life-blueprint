import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface Props { onSync: () => void; isSyncing: boolean }

const WearableSyncButton: React.FC<Props> = ({ onSync, isSyncing }) => (
  <TouchableOpacity style={styles.btn} onPress={onSync} disabled={isSyncing}>
    {isSyncing
      ? <ActivityIndicator color="#fff" />
      : <Text style={styles.text}>⚡ Sync Now</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 14, alignItems: 'center' },
  text: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default WearableSyncButton;
