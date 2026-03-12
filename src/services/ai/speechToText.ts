/** Speech-to-text wrapper using the React Native / Expo pattern. */

type ResultCallback = (transcript: string) => void;
type ErrorCallback = (error: string) => void;

// Lazily-loaded expo-speech-recognition (optional peer dep)
let ExpoSpeechRecognition: {
  startListeningAsync: (opts: Record<string, unknown>) => Promise<void>;
  stopListeningAsync: () => Promise<void>;
  addListener: (event: string, cb: (r: { value: string[] }) => void) => { remove: () => void };
  isAvailableAsync: () => Promise<boolean>;
} | null = null;

try {
  ExpoSpeechRecognition = require('expo-speech-recognition');
} catch {
  // Not installed – mock responses
}

let _isListening = false;
let _subscription: { remove: () => void } | null = null;

export let isListening = false;

export function startListening(
  onResult: ResultCallback,
  onError: ErrorCallback,
): void {
  if (_isListening) return;

  if (!ExpoSpeechRecognition) {
    // Development mock: simulate a transcription after 2s
    _isListening = true;
    isListening = true;
    setTimeout(() => {
      _isListening = false;
      isListening = false;
      onResult('Log 500 calories');
    }, 2000);
    return;
  }

  _isListening = true;
  isListening = true;

  _subscription = ExpoSpeechRecognition.addListener(
    'result',
    (e: { value: string[] }) => {
      const transcript = e.value?.[0] ?? '';
      if (transcript) {
        onResult(transcript);
        stopListening();
      }
    },
  );

  ExpoSpeechRecognition.startListeningAsync({
    lang: 'en-US',
    interimResults: false,
    continuous: false,
  }).catch((err: unknown) => {
    _isListening = false;
    isListening = false;
    onError(String(err));
  });
}

export function stopListening(): void {
  _isListening = false;
  isListening = false;
  _subscription?.remove();
  _subscription = null;
  ExpoSpeechRecognition?.stopListeningAsync().catch(() => {});
}

export async function isSupported(): Promise<boolean> {
  if (!ExpoSpeechRecognition) return false;
  return ExpoSpeechRecognition.isAvailableAsync();
}
