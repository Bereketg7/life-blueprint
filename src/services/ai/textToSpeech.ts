/** Text-to-speech wrapper using the React Native Speech API pattern. */

type SpeakOptions = {
  rate?: number;   // 0.1 – 2.0, default 0.9
  pitch?: number;  // 0.5 – 2.0, default 1.0
  language?: string; // e.g. 'en-US'
};

// Lazily-loaded Expo Speech module (optional peer dep)
let ExpoSpeech: {
  speak: (text: string, opts?: Record<string, unknown>) => void;
  stop: () => void;
  isSpeakingAsync: () => Promise<boolean>;
} | null = null;

try {
  // expo-speech is optionally available; fall back gracefully if absent
  ExpoSpeech = require('expo-speech');
} catch {
  // Not installed – use console fallback
}

let _speaking = false;

export async function speak(text: string, options?: SpeakOptions): Promise<void> {
  if (!ExpoSpeech) {
    console.log('[TTS]', text);
    return;
  }
  _speaking = true;
  return new Promise((resolve) => {
    ExpoSpeech!.speak(text, {
      rate: options?.rate ?? 0.9,
      pitch: options?.pitch ?? 1.0,
      language: options?.language ?? 'en-US',
      onDone: () => {
        _speaking = false;
        resolve();
      },
      onStopped: () => {
        _speaking = false;
        resolve();
      },
      onError: () => {
        _speaking = false;
        resolve();
      },
    });
  });
}

export function stop(): void {
  ExpoSpeech?.stop();
  _speaking = false;
}

export function isSupported(): boolean {
  return ExpoSpeech !== null;
}

export async function isSpeaking(): Promise<boolean> {
  if (!ExpoSpeech) return false;
  return ExpoSpeech.isSpeakingAsync();
}
