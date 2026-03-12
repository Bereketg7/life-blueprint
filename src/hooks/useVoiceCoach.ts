import { useState, useCallback } from 'react';
import { CoachMessage } from '../types';
import { getChatCompletion, coachMessagesToOpenAI } from '../services/ai/openaiApi';
import { buildSystemPrompt, getMotivationalOpener } from '../services/ai/coachPersonality';
import { parseVoiceCommand } from '../services/ai/voiceCommands';
import { startListening, stopListening } from '../services/ai/voiceCoach';
import { UserProfile } from '../types';

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function useVoiceCoach(userId: string, profile: UserProfile | null = null) {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: generateId(),
      userId,
      role: 'coach',
      content: getMotivationalOpener(),
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: CoachMessage = {
        id: generateId(),
        userId,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const systemPrompt = buildSystemPrompt(profile);
        const openAIMessages = coachMessagesToOpenAI(
          [...messages, userMsg],
          systemPrompt
        );
        const response = await getChatCompletion(openAIMessages);

        const voiceCmd = parseVoiceCommand(content);

        const coachMsg: CoachMessage = {
          id: generateId(),
          userId,
          role: 'coach',
          content: response,
          timestamp: new Date().toISOString(),
          action: voiceCmd
            ? { type: voiceCmd.action, payload: voiceCmd.parameters }
            : undefined,
        };
        setMessages((prev) => [...prev, coachMsg]);
        return coachMsg;
      } finally {
        setLoading(false);
      }
    },
    [userId, profile, messages]
  );

  const startVoiceInput = useCallback(() => {
    setIsListening(true);
    startListening(
      (transcript) => {
        setIsListening(false);
        if (transcript) sendMessage(transcript);
      },
      (err) => {
        setIsListening(false);
        console.error('[VoiceCoach] Error:', err);
      }
    );
  }, [sendMessage]);

  const stopVoiceInput = useCallback(() => {
    stopListening();
    setIsListening(false);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([
      {
        id: generateId(),
        userId,
        role: 'coach',
        content: getMotivationalOpener(),
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [userId]);

  return {
    messages,
    isListening,
    loading,
    sendMessage,
    startVoiceInput,
    stopVoiceInput,
    clearHistory,
  };
}
