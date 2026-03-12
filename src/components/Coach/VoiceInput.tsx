import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { theme } from '../../styles/theme';

type Props = {
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  disabled?: boolean;
};

export function VoiceInput({
  isListening,
  onStartListening,
  onStopListening,
  disabled = false,
}: Props) {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.4,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isListening, pulseAnim]);

  const handlePress = () => {
    if (disabled) return;
    isListening ? onStopListening() : onStartListening();
  };

  return (
    <View style={styles.container}>
      {/* Pulsing ring */}
      {isListening && (
        <Animated.View
          style={[
            styles.pulseRing,
            { transform: [{ scale: pulseAnim }] },
          ]}
        />
      )}

      <TouchableOpacity
        style={[styles.button, isListening && styles.buttonActive, disabled && styles.buttonDisabled]}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text style={styles.micIcon}>{isListening ? '⏹' : '🎙️'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>
        {isListening ? 'Listening…' : 'Tap to speak'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary + '33',
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  buttonActive: {
    backgroundColor: theme.colors.primary + '33',
    borderColor: theme.colors.error,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  micIcon: {
    fontSize: 28,
  },
  label: {
    marginTop: 8,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.xs,
    fontWeight: '500',
  },
});

export default VoiceInput;
