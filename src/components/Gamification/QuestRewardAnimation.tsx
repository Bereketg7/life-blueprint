import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { QuestReward } from '../../types';

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
  emoji: string;
}

const PARTICLE_EMOJIS = ['✨', '⭐', '🌟', '💫', '🎊', '🎉'];
const PARTICLE_COLORS = ['#6C63FF', '#FFC107', '#4CAF50', '#FF6B35', '#B9F2FF'];

function createParticle(index: number): Particle {
  return {
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0),
    color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
    emoji: PARTICLE_EMOJIS[index % PARTICLE_EMOJIS.length],
  };
}

interface QuestRewardAnimationProps {
  reward: QuestReward | null;
  visible: boolean;
  onAnimationEnd?: () => void;
}

export const QuestRewardAnimation: React.FC<QuestRewardAnimationProps> = ({
  reward,
  visible,
  onAnimationEnd,
}) => {
  const titleScale = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const xpTranslateY = useRef(new Animated.Value(0)).current;
  const xpOpacity = useRef(new Animated.Value(0)).current;
  const coinTranslateY = useRef(new Animated.Value(0)).current;
  const coinOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;

  const PARTICLE_COUNT = 12;
  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => createParticle(i)),
  ).current;

  // All animated values are stable useRef instances — no reactive deps needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runAnimation = useCallback(() => {
    // Reset
    titleScale.setValue(0);
    titleOpacity.setValue(0);
    xpTranslateY.setValue(0);
    xpOpacity.setValue(0);
    coinTranslateY.setValue(0);
    coinOpacity.setValue(0);
    containerOpacity.setValue(0);
    particles.forEach(p => {
      p.x.setValue(0);
      p.y.setValue(0);
      p.opacity.setValue(0);
      p.scale.setValue(0);
    });

    Animated.sequence([
      Animated.timing(containerOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(titleScale, {
          toValue: 1,
          tension: 60,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ...particles.map((p, i) =>
          Animated.parallel([
            Animated.timing(p.opacity, {
              toValue: 1,
              duration: 300,
              delay: i * 40,
              useNativeDriver: true,
            }),
            Animated.spring(p.scale, {
              toValue: 1,
              tension: 80,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.timing(p.x, {
              toValue: (Math.random() - 0.5) * 200,
              duration: 1000,
              delay: i * 40,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(p.y, {
              toValue: -100 - Math.random() * 150,
              duration: 1000,
              delay: i * 40,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ),
      ]),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(xpOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(xpTranslateY, { toValue: -30, duration: 500, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
        Animated.timing(coinOpacity, { toValue: 1, duration: 300, delay: 150, useNativeDriver: true }),
        Animated.timing(coinTranslateY, { toValue: -30, duration: 500, delay: 150, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      ]),
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(containerOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ...particles.map(p =>
          Animated.timing(p.opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ),
      ]),
    ]).start(() => {
      onAnimationEnd?.();
    });
  }, []);

  useEffect(() => {
    if (visible && reward) {
      runAnimation();
    }
  }, [visible, reward]);

  if (!visible || !reward) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: containerOpacity }]} pointerEvents="none">
      {/* Particles */}
      {particles.map((p, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.particle,
            {
              opacity: p.opacity,
              transform: [{ translateX: p.x }, { translateY: p.y }, { scale: p.scale }],
            },
          ]}
        >
          {p.emoji}
        </Animated.Text>
      ))}

      {/* QUEST COMPLETE text */}
      <Animated.Text
        style={[
          styles.questCompleteText,
          { opacity: titleOpacity, transform: [{ scale: titleScale }] },
        ]}
      >
        QUEST COMPLETE!
      </Animated.Text>

      {/* Floating XP */}
      <Animated.Text
        style={[
          styles.xpFloat,
          { opacity: xpOpacity, transform: [{ translateY: xpTranslateY }] },
        ]}
      >
        +{reward.xpAwarded} XP
      </Animated.Text>

      {/* Floating Coins */}
      <Animated.Text
        style={[
          styles.coinFloat,
          { opacity: coinOpacity, transform: [{ translateY: coinTranslateY }] },
        ]}
      >
        +{reward.coinsAwarded} 🪙
      </Animated.Text>

      {/* Message */}
      <Animated.Text style={[styles.message, { opacity: titleOpacity }]}>
        {reward.message}
      </Animated.Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13, 13, 26, 0.85)',
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
    fontSize: 24,
  },
  questCompleteText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#6C63FF',
    letterSpacing: 2,
    textShadowColor: '#6C63FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 16,
  },
  xpFloat: {
    fontSize: 28,
    fontWeight: '800',
    color: '#6C63FF',
    marginTop: 8,
  },
  coinFloat: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFC107',
    marginTop: 4,
  },
  message: {
    fontSize: 16,
    color: '#B0B0CC',
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default QuestRewardAnimation;
