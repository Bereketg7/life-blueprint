import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { WearableDevice } from '../../types';

interface Props {
  visible: boolean;
  onConnect: (type: WearableDevice['type']) => void;
  onClose: () => void;
}

const DEVICE_OPTIONS: Array<{ type: WearableDevice['type']; label: string; emoji: string }> = [
  { type: 'apple_health', label: 'Apple Health', emoji: '🍎' },
  { type: 'fitbit', label: 'Fitbit', emoji: '⌚' },
  { type: 'garmin', label: 'Garmin', emoji: '🏃' },
];

const WearableConnectModal: React.FC<Props> = ({ visible, onConnect, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Connect Wearable</Text>
        {DEVICE_OPTIONS.map((opt) => (
          <TouchableOpacity key={opt.type} style={styles.option} onPress={() => onConnect(opt.type)}>
            <Text style={styles.optionText}>{opt.emoji} {opt.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.cancel} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { backgroundColor: '#1A1A2E', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16 },
  option: { backgroundColor: '#16213E', borderRadius: 12, padding: 16, marginBottom: 8 },
  optionText: { color: '#fff', fontSize: 16 },
  cancel: { marginTop: 8, alignItems: 'center', padding: 12 },
  cancelText: { color: '#B0B0CC', fontSize: 16 },
});

export default WearableConnectModal;
