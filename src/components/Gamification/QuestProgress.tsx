import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { QuestProgress as QuestProgressType } from '../../types';

interface QuestProgressProps {
  progress: QuestProgressType;
  bonusXp?: number;
}

const CIRCLE_RADIUS = 36;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export const QuestProgress: React.FC<QuestProgressProps> = ({
  progress,
  bonusXp = 500,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const percent =
    progress.totalQuests > 0
      ? progress.completedQuests / progress.totalQuests
      : 0;

  useEffect(() => {
    // scaleX is used instead of width % so useNativeDriver: true is possible
    Animated.timing(animatedValue, {
      toValue: percent,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [percent]);

  const allDone = progress.completedQuests === progress.totalQuests && progress.totalQuests > 0;

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCLE_CIRCUMFERENCE, 0],
  });

  return (
    <View style={styles.container}>
      {/* Circular progress (SVG-free: use border arc trick) */}
      <View style={styles.circleWrapper}>
        <View style={styles.circleOuter}>
          <View style={styles.circleInner}>
            <Text style={styles.circlePercent}>
              {Math.round(percent * 100)}%
            </Text>
          </View>
        </View>
        {/* Filled arc overlay using rotation */}
        <Animated.View
          style={[
            styles.arcFill,
            {
              transform: [
                {
                  rotate: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Text info */}
      <View style={styles.textSection}>
        <Text style={styles.questCount}>
          <Text style={styles.questDone}>{progress.completedQuests}</Text>
          <Text style={styles.questTotal}> of {progress.totalQuests} quests complete</Text>
        </Text>
        <Text style={styles.xpEarned}>⚡ {progress.totalXpEarned} XP earned today</Text>
        <Text style={styles.coinsEarned}>🪙 {progress.totalCoinsEarned} coins earned today</Text>
        {allDone && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusText}>🎉 All done! +{bonusXp} bonus XP!</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
    gap: 16,
  },
  circleWrapper: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D0D1A',
  },
  circleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePercent: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  arcFill: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: '#6C63FF',
  },
  textSection: {
    flex: 1,
  },
  questCount: {
    marginBottom: 4,
  },
  questDone: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  questTotal: {
    fontSize: 14,
    color: '#B0B0CC',
  },
  xpEarned: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '600',
    marginBottom: 2,
  },
  coinsEarned: {
    fontSize: 13,
    color: '#FFC107',
    fontWeight: '600',
  },
  bonusBadge: {
    marginTop: 8,
    backgroundColor: '#4CAF5022',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  bonusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '700',
  },
});

export default QuestProgress;
