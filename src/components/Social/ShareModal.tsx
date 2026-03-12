import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface Props { visible: boolean; message: string; onShare: () => void; onClose: () => void }

const ShareModal: React.FC<Props> = ({ visible, message, onShare, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Share Progress 🚀</Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.share} onPress={onShare}>
          <Text style={styles.shareText}>Share Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancel} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  container: { backgroundColor: '#1A1A2E', borderRadius: 20, padding: 24, width: '80%' },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  message: { color: '#B0B0CC', fontSize: 14, marginBottom: 16 },
  share: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 14, alignItems: 'center' },
  shareText: { color: '#fff', fontWeight: '700' },
  cancel: { alignItems: 'center', padding: 12 },
  cancelText: { color: '#B0B0CC' },
});

export default ShareModal;
