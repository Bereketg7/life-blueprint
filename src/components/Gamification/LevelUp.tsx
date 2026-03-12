import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props { level: number; title: string; onDismiss: () => void }

const LevelUp: React.FC<Props> = ({ level, title, onDismiss }) => (
  <View style={styles.overlay}>
    <Text style={styles.emoji}>⭐</Text>
    <Text style={styles.title}>Level Up!</Text>
    <Text style={styles.level}>Level {level}</Text>
    <Text style={styles.titleText}>{title}</Text>
    <TouchableOpacity style={styles.btn} onPress={onDismiss}>
      <Text style={styles.btnText}>Awesome!</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(108,99,255,0.9)', zIndex: 999 },
  emoji: { fontSize: 72 },
  title: { color: '#fff', fontSize: 32, fontWeight: '700', marginTop: 8 },
  level: { color: '#FFC107', fontSize: 48, fontWeight: '700' },
  titleText: { color: '#fff', fontSize: 18, marginBottom: 24 },
  btn: { backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 32, paddingVertical: 14 },
  btnText: { color: '#6C63FF', fontWeight: '700', fontSize: 16 },
});

export default LevelUp;
