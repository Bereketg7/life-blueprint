import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { CoachMessage } from '../../types';

interface Props { messages: CoachMessage[] }

const CoachChat: React.FC<Props> = ({ messages }) => (
  <ScrollView contentContainerStyle={styles.container}>
    {messages.map((msg) => (
      <View key={msg.id} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.coachBubble]}>
        <Text style={styles.text}>{msg.content}</Text>
        <Text style={styles.time}>{new Date(msg.timestamp).toLocaleTimeString()}</Text>
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  bubble: { borderRadius: 16, padding: 12, marginBottom: 8, maxWidth: '80%' },
  userBubble: { backgroundColor: '#6C63FF', alignSelf: 'flex-end' },
  coachBubble: { backgroundColor: '#16213E', alignSelf: 'flex-start' },
  text: { color: '#fff', fontSize: 14 },
  time: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 4, textAlign: 'right' },
});

export default CoachChat;
