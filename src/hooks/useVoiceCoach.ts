import { useState, useCallback, useRef } from 'react';
import { CoachMessage } from '../types';
import { VoiceCoach } from '../services/ai/voiceCoach';
import { startListening, stopListening } from '../services/ai/speechToText';
import { speak, stop as stopSpeech } from '../services/ai/textToSpeech';
import { parseVoiceCommand } from '../services/ai/voiceCommands';

function makeId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

type UseVoiceCoachResult = {
  messages: CoachMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  startVoiceInput: () => void;
  stopVoiceInput: () => void;
  clearHistory: () => void;
  currentSpeakingMessage: CoachMessage | null;
  playMessage: (message: CoachMessage) => Promise<void>;
  stopSpeaking: () => void;
};

export function useVoiceCoach(userId: string): UseVoiceCoachResult {
  const coachRef = useRef<VoiceCoach>(new VoiceCoach(userId));

  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSpeakingMessage, setCurrentSpeakingMessage] =
    useState<CoachMessage | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setIsLoading(true);

    // Optimistically add user message
    const userMsg: CoachMessage = {
      id: makeId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const coachMsg = await coachRef.current.sendTextMessage(text);
      setMessages((prev) => [...prev, coachMsg]);

      // Auto-speak the coach response
      setIsSpeaking(true);
      setCurrentSpeakingMessage(coachMsg);
      await speak(coachMsg.content);
      setIsSpeaking(false);
      setCurrentSpeakingMessage(null);
    } catch (err) {
      const errorMsg: CoachMessage = {
        id: makeId(),
        role: 'coach',
        content:
          'Sorry, I encountered an error. Please try again in a moment.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startVoiceInput = useCallback(() => {
    if (isListening) return;
    setIsListening(true);

    startListening(
      (transcript: string) => {
        setIsListening(false);
        // Check if it's a voice command
        const command = parseVoiceCommand(transcript);
        if (command && command.type !== 'unknown') {
          // Turn the command into a natural message
          sendMessage(transcript);
        } else {
          sendMessage(transcript);
        }
      },
      (error: string) => {
        console.warn('[VoiceCoach] STT error:', error);
        setIsListening(false);
      },
    );
  }, [isListening, sendMessage]);

  const stopVoiceInput = useCallback(() => {
    stopListening();
    setIsListening(false);
  }, []);

  const playMessage = useCallback(async (message: CoachMessage) => {
    stopSpeech();
    setIsSpeaking(true);
    setCurrentSpeakingMessage(message);
    await speak(message.content);
    setIsSpeaking(false);
    setCurrentSpeakingMessage(null);
  }, []);

  const stopSpeaking = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
    setCurrentSpeakingMessage(null);
  }, []);

  const clearHistory = useCallback(() => {
    coachRef.current.startSession();
    setMessages([]);
  }, []);

  return {
    messages,
    isListening,
    isSpeaking,
    isLoading,
    sendMessage,
    startVoiceInput,
    stopVoiceInput,
    clearHistory,
    currentSpeakingMessage,
    playMessage,
    stopSpeaking,
  };
}

export default useVoiceCoach;
