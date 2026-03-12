import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { CoachMessage } from '../../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  messages: CoachMessage[];
  loading: boolean;
  listening: boolean;
  onSendMessage: (text: string) => void;
  onStartListening: () => void;
}

function MessageBubble({ message }: { message: CoachMessage }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
      <Text style={[styles.bubbleText, isUser ? styles.userText : styles.assistantText]}>
        {message.content}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

export default function VoiceCoachModal({ visible, onClose, messages, loading, listening, onSendMessage, onStartListening }: Props) {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🤖 AI Health Coach</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>👋 Hi! I'm your AI health coach.</Text>
              <Text style={styles.emptySubtext}>Ask me about workouts, nutrition, sleep, or anything health-related!</Text>
            </View>
          }
        />

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#4F86F7" />
            <Text style={styles.loadingText}>Coach is thinking...</Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TouchableOpacity
            style={[styles.voiceButton, listening && styles.voiceButtonActive]}
            onPress={onStartListening}
          >
            <Text style={styles.voiceIcon}>{listening ? '🔴' : '🎤'}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask your coach..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#4F86F7', paddingTop: 50 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  closeButton: { padding: 4 },
  closeText: { color: '#fff', fontSize: 20, fontWeight: '300' },
  messageList: { padding: 16, paddingBottom: 8 },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 12, marginVertical: 4 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#4F86F7' },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  userText: { color: '#fff' },
  assistantText: { color: '#222' },
  timestamp: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4, alignSelf: 'flex-end' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingLeft: 16 },
  loadingText: { color: '#666', marginLeft: 8, fontSize: 13 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  voiceButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  voiceButtonActive: { backgroundColor: '#FFE5E5' },
  voiceIcon: { fontSize: 20 },
  input: { flex: 1, backgroundColor: '#f8f8f8', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 120 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4F86F7', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  sendButtonDisabled: { opacity: 0.4 },
  sendIcon: { color: '#fff', fontSize: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyText: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
});
