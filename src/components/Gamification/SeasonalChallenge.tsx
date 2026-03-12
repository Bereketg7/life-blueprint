import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SeasonalChallenge } from '../../types';

interface SeasonalChallengeCardProps {
  challenge: SeasonalChallenge;
}

function getDaysRemaining(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export const SeasonalChallengeCard: React.FC<SeasonalChallengeCardProps> = ({
  challenge,
}) => {
  const progress = challenge.targetValue > 0
    ? Math.min(100, (challenge.currentValue / challenge.targetValue) * 100)
    : 0;
  const daysLeft = getDaysRemaining(challenge.expiresAt);
  const isComplete = !!challenge.completedAt;

  return (
    <View style={[styles.card, isComplete && styles.cardComplete]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.weekBadge}>Week {challenge.weekNumber}</Text>
          <Text style={[styles.daysLeft, daysLeft <= 2 && styles.daysLeftUrgent]}>
            {isComplete ? '✅ Complete' : `${daysLeft}d left`}
          </Text>
        </View>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.description}>{challenge.description}</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: isComplete ? '#4CAF50' : '#6C63FF',
              },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {challenge.currentValue} / {challenge.targetValue}
        </Text>
      </View>

      {/* Reward */}
      <View style={styles.rewardRow}>
        <Text style={styles.rewardXp}>⚡ +{challenge.xpReward} XP</Text>
        <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  cardComplete: {
    borderColor: '#4CAF5044',
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  weekBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C63FF',
    backgroundColor: '#6C63FF22',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  daysLeft: {
    fontSize: 12,
    color: '#B0B0CC',
    fontWeight: '600',
  },
  daysLeftUrgent: {
    color: '#F44336',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#B0B0CC',
    lineHeight: 18,
  },
  progressSection: {
    gap: 4,
    marginBottom: 10,
  },
  progressBg: {
    height: 8,
    backgroundColor: '#0D0D1A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: '#B0B0CC',
    textAlign: 'right',
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardXp: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C63FF',
  },
  progressPct: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SeasonalChallengeCard;
