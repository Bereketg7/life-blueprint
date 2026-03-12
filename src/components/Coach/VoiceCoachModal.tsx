import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import CoachChat from './CoachChat';
import VoiceInput from './VoiceInput';
import { CoachMessage } from '../../types';

interface Props {
  visible: boolean;
  messages: CoachMessage[];
  isListening: boolean;
  loading: boolean;
  onSendMessage: (text: string) => void;
  onStartVoice: () => void;
  onClose: () => void;
}

const VoiceCoachModal: React.FC<Props> = ({ visible, messages, isListening, loading, onSendMessage, onStartVoice, onClose }) => {
  const [input, setInput] = useState('');
  return (
    <Modal visible={visible} animationType="slide">
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.title}>�� AI Coach</Text>
          <TouchableOpacity onPress={onClose}><Text style={styles.close}>✕</Text></TouchableOpacity>
        </View>
        <CoachChat messages={messages} />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Ask your coach..."
            placeholderTextColor="#6B6B8A"
            onSubmitEditing={() => { if (input.trim()) { onSendMessage(input.trim()); setInput(''); } }}
          />
          <VoiceInput isListening={isListening} onPress={onStartVoice} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 48 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  close: { color: '#B0B0CC', fontSize: 18, padding: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8 },
  textInput: { flex: 1, backgroundColor: '#16213E', borderRadius: 20, padding: 12, color: '#fff', fontSize: 14 },
});

export default VoiceCoachModal;
