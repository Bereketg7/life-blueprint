import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { isSpeaking: boolean }

const VoiceOutput: React.FC<Props> = ({ isSpeaking }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{isSpeaking ? '🔊' : '🔇'}</Text>
    <Text style={styles.label}>{isSpeaking ? 'Speaking...' : 'Silent'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  icon: { fontSize: 16, marginRight: 4 },
  label: { color: '#B0B0CC', fontSize: 12 },
});

export default VoiceOutput;
