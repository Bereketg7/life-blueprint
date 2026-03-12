import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LevelUnlock } from '../../types';
import { LevelBadge } from './LevelBadge';

interface LevelUpProps {
  newLevel: number;
  unlocks: LevelUnlock[];
  visible: boolean;
  onDismiss: () => void;
}

interface SparkleProps {
  delay: number;
  x: number;
  y: number;
}

const Sparkle: React.FC<SparkleProps> = ({ delay, x, y }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, tension: 80, friction: 4, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(800),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.sparkle,
        { left: x, top: y, opacity, transform: [{ scale }] },
      ]}
    >
      ✨
    </Animated.Text>
  );
};

const SPARKLES = [
  { x: 30, y: 60, delay: 0 },
  { x: 280, y: 80, delay: 200 },
  { x: 60, y: 200, delay: 400 },
  { x: 260, y: 220, delay: 150 },
  { x: 140, y: 40, delay: 300 },
  { x: 20, y: 320, delay: 600 },
  { x: 300, y: 340, delay: 450 },
  { x: 150, y: 420, delay: 100 },
];

export const LevelUp: React.FC<LevelUpProps> = ({
  newLevel,
  unlocks,
  visible,
  onDismiss,
}) => {
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const levelScale = useRef(new Animated.Value(0)).current;
  const levelOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const unlocksOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    containerOpacity.setValue(0);
    levelScale.setValue(0);
    levelOpacity.setValue(0);
    textOpacity.setValue(0);
    unlocksOpacity.setValue(0);

    Animated.sequence([
      Animated.timing(containerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(levelScale, { toValue: 1, tension: 50, friction: 4, useNativeDriver: true }),
        Animated.timing(levelOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(unlocksOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: containerOpacity }]}>
      {/* Sparkles */}
      {SPARKLES.map((s, i) => (
        <Sparkle key={i} x={s.x} y={s.y} delay={s.delay} />
      ))}

      {/* Level Up banner */}
      <Animated.Text style={[styles.levelUpText, { opacity: textOpacity }]}>
        LEVEL UP!
      </Animated.Text>

      {/* Level badge animation */}
      <Animated.View
        style={[
          styles.badgeContainer,
          { opacity: levelOpacity, transform: [{ scale: levelScale }] },
        ]}
      >
        <LevelBadge level={newLevel} size="large" />
      </Animated.View>

      <Animated.Text style={[styles.levelNumber, { opacity: levelOpacity }]}>
        Level {newLevel}
      </Animated.Text>

      {/* Unlocks */}
      {unlocks.length > 0 && (
        <Animated.View style={[styles.unlocksContainer, { opacity: unlocksOpacity }]}>
          <Text style={styles.unlocksTitle}>🔓 New Unlocks!</Text>
          {unlocks.map(u => (
            <View key={u.level + u.feature} style={styles.unlockItem}>
              <Text style={styles.unlockIcon}>{u.icon}</Text>
              <View style={styles.unlockInfo}>
                <Text style={styles.unlockFeature}>{u.feature}</Text>
                <Text style={styles.unlockDesc}>{u.description}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      )}

      {/* Dismiss button */}
      <Animated.View style={{ opacity: unlocksOpacity }}>
        <Text style={styles.dismissButton} onPress={onDismiss}>
          Tap to Continue
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(13, 13, 26, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    paddingHorizontal: 24,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 20,
  },
  levelUpText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#6C63FF',
    letterSpacing: 4,
    textShadowColor: '#6C63FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
    marginBottom: 24,
  },
  badgeContainer: {
    marginBottom: 12,
  },
  levelNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  unlocksContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  unlocksTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  unlockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#0D0D1A',
  },
  unlockIcon: {
    fontSize: 24,
  },
  unlockInfo: {
    flex: 1,
  },
  unlockFeature: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  unlockDesc: {
    fontSize: 12,
    color: '#B0B0CC',
    marginTop: 2,
  },
  dismissButton: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '700',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#6C63FF',
    borderRadius: 30,
    overflow: 'hidden',
  },
});

export default LevelUp;
