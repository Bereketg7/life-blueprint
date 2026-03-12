import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Quest } from '../../types';

const DIFFICULTY_COLORS: Record<Quest['difficulty'], string> = {
  easy: '#4CAF50',
  medium: '#FFC107',
  hard: '#FF6B35',
  legendary: '#6C63FF',
};

const TYPE_ICONS: Record<Quest['type'], string> = {
  workout: '🏋️',
  nutrition: '🥗',
  water: '💧',
  sleep: '😴',
  meditation: '🧘',
  steps: '👟',
};

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onUpdateProgress: (id: string, value: number) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onComplete,
  onUpdateProgress,
}) => {
  const progressPercent = Math.min(
    100,
    quest.targetValue > 0 ? (quest.currentValue / quest.targetValue) * 100 : 0,
  );
  const isCompleted = quest.status === 'completed';
  const isExpired = quest.status === 'expired';
  const canComplete =
    !isCompleted && !isExpired && quest.currentValue >= quest.targetValue;

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted, isExpired && styles.cardExpired]}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.iconWrapper}>
          <Text style={styles.typeIcon}>{TYPE_ICONS[quest.type]}</Text>
        </View>

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={1}>
              {quest.title}
            </Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: DIFFICULTY_COLORS[quest.difficulty] + '33' },
              ]}
            >
              <Text style={[styles.difficultyText, { color: DIFFICULTY_COLORS[quest.difficulty] }]}>
                {quest.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {quest.description}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent}%`, backgroundColor: DIFFICULTY_COLORS[quest.difficulty] },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {quest.currentValue} / {quest.targetValue} {quest.unit}
        </Text>
      </View>

      {/* Rewards & button */}
      <View style={styles.bottomRow}>
        <View style={styles.rewards}>
          <Text style={styles.rewardXp}>⚡ {quest.xpReward} XP</Text>
          <Text style={styles.rewardCoins}>🪙 {quest.coinReward}</Text>
        </View>

        {isCompleted ? (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✅ Done</Text>
          </View>
        ) : isExpired ? (
          <View style={styles.expiredBadge}>
            <Text style={styles.expiredText}>Expired</Text>
          </View>
        ) : canComplete ? (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => onComplete(quest.id)}
          >
            <Text style={styles.completeButtonText}>Claim</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => onUpdateProgress(quest.id, quest.currentValue + 1)}
          >
            <Text style={styles.updateButtonText}>+1</Text>
          </TouchableOpacity>
        )}
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
  cardCompleted: {
    borderColor: '#4CAF5044',
    backgroundColor: '#16213E',
    opacity: 0.85,
  },
  cardExpired: {
    opacity: 0.5,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  titleCompleted: {
    color: '#B0B0CC',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: '#B0B0CC',
    lineHeight: 18,
  },
  progressSection: {
    marginBottom: 12,
    gap: 4,
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
    fontSize: 12,
    color: '#B0B0CC',
    textAlign: 'right',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewards: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardXp: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C63FF',
  },
  rewardCoins: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFC107',
  },
  completeButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  updateButtonText: {
    color: '#6C63FF',
    fontWeight: '700',
    fontSize: 14,
  },
  completedBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#4CAF5022',
  },
  completedText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 13,
  },
  expiredBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F4433622',
  },
  expiredText: {
    color: '#F44336',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default QuestCard;
