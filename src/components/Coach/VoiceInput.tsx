import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface Props { isListening: boolean; onPress: () => void }

const VoiceInput: React.FC<Props> = ({ isListening, onPress }) => (
  <TouchableOpacity style={[styles.btn, isListening && styles.listening]} onPress={onPress}>
    <Text style={styles.icon}>{isListening ? '🔴' : '🎤'}</Text>
    <Text style={styles.label}>{isListening ? 'Listening...' : 'Speak'}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: { backgroundColor: '#16213E', borderRadius: 50, padding: 16, alignItems: 'center', width: 80, height: 80, justifyContent: 'center' },
  listening: { backgroundColor: '#FF6B6B' },
  icon: { fontSize: 24 },
  label: { color: '#B0B0CC', fontSize: 10, marginTop: 2 },
});

export default VoiceInput;
