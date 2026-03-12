// Voice coach – text-to-speech and speech-to-text

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  language?: string;
}

export async function speak(text: string, options: TTSOptions = {}): Promise<void> {
  // In production, use expo-speech or react-native-tts
  console.log('[VoiceCoach] Speaking:', text, options);
}

export async function startListening(
  onResult: (transcript: string) => void,
  onError: (error: string) => void
): Promise<void> {
  // In production, use @react-native-voice/voice or expo-speech
  console.log('[VoiceCoach] Listening for voice input...');
  // Stub: simulate a result after 2s
  setTimeout(() => {
    onResult('');
  }, 2000);
}

export async function stopListening(): Promise<void> {
  console.log('[VoiceCoach] Stopped listening');
}

export function isVoiceAvailable(): boolean {
  return false; // returns true when native voice module is installed
}
