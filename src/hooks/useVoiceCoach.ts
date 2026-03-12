import { useState, useCallback } from 'react';
import { CoachMessage, VoiceCommand } from '../types';
import { sendMessage, parseVoiceCommand, tts, stt } from '../services/ai';

export function useVoiceCoach() {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);

  const sendUserMessage = useCallback(async (content: string) => {
    const userMsg: CoachMessage = {
      id: `${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendMessage(content, messages);
      setMessages(prev => [...prev, response]);

      setSpeaking(true);
      await tts.speak(response.content);
      setSpeaking(false);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const startListening = useCallback(async (): Promise<VoiceCommand | null> => {
    setListening(true);
    try {
      let command: VoiceCommand | null = null;
      await stt.startListening((text) => {
        command = parseVoiceCommand(text);
        sendUserMessage(text);
      });
      return command;
    } finally {
      setListening(false);
    }
  }, [sendUserMessage]);

  const clearHistory = useCallback(() => setMessages([]), []);

  return { messages, loading, speaking, listening, sendUserMessage, startListening, clearHistory };
}
