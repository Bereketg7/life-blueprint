import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { CoachMessage } from '../../types';
import { CoachChat } from './CoachChat';
import { VoiceInput } from './VoiceInput';
import { VoiceOutput } from './VoiceOutput';
import { theme } from '../../styles/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  messages: CoachMessage[];
  isLoading?: boolean;
  isListening?: boolean;
  isSpeaking?: boolean;
  currentSpeakingMessage?: CoachMessage | null;
  onSendMessage: (text: string) => void;
  onStartVoiceInput: () => void;
  onStopVoiceInput: () => void;
  onPlayMessage?: (message: CoachMessage) => void;
  onStopSpeaking?: () => void;
};

export function VoiceCoachModal({
  visible,
  onClose,
  messages,
  isLoading = false,
  isListening = false,
  isSpeaking = false,
  currentSpeakingMessage = null,
  onSendMessage,
  onStartVoiceInput,
  onStopVoiceInput,
  onPlayMessage,
  onStopSpeaking,
}: Props) {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setInputText('');
    onSendMessage(trimmed);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.coachInfo}>
            <Text style={styles.avatar}>🤖</Text>
            <View>
              <Text style={styles.coachName}>Alex — Wellness Coach</Text>
              <Text style={styles.coachStatus}>
                {isLoading ? '⏳ Thinking…' : isListening ? '🎙️ Listening…' : '● Online'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* TTS playback bar */}
        {(isSpeaking || currentSpeakingMessage) && (
          <View style={styles.ttsBar}>
            <VoiceOutput
              message={currentSpeakingMessage}
              isSpeaking={isSpeaking}
              onPlay={onPlayMessage}
              onStop={onStopSpeaking}
            />
          </View>
        )}

        {/* Chat history */}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <CoachChat messages={messages} isTyping={isLoading} />

          {/* Input area */}
          <View style={styles.inputArea}>
            <VoiceInput
              isListening={isListening}
              onStartListening={onStartVoiceInput}
              onStopListening={onStopVoiceInput}
            />

            <View style={styles.textInputRow}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask your coach anything…"
                placeholderTextColor={theme.colors.text.secondary}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  coachInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    fontSize: 36,
  },
  coachName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
  },
  coachStatus: {
    color: theme.colors.success,
    fontSize: theme.typography.sizes.xs,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  ttsBar: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  inputArea: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface,
    gap: theme.spacing.sm,
  },
  textInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.sm,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: theme.colors.card,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default VoiceCoachModal;
