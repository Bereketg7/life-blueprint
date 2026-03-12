import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserLevel } from '../../types';
import { getLevelProgress } from '../../services/gamification/leveling';

interface Props {
  userLevel: UserLevel;
}

const TIER_COLORS: Record<UserLevel['tier'], string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  diamond: '#B9F2FF',
  platinum: '#E5E4E2',
  legendary: '#FF6B35',
};

const TIER_EMOJIS: Record<UserLevel['tier'], string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  diamond: '💎',
  platinum: '⭐',
  legendary: '🌟',
};

export default function LevelProgress({ userLevel }: Props) {
  const progress = getLevelProgress(userLevel);
  const tierColor = TIER_COLORS[userLevel.tier];

  return (
    <View style={styles.container}>
      <View style={styles.levelBadge}>
        <Text style={styles.tierEmoji}>{TIER_EMOJIS[userLevel.tier]}</Text>
        <Text style={[styles.level, { color: tierColor }]}>{userLevel.level}</Text>
        <Text style={styles.tierName}>{userLevel.tier.toUpperCase()}</Text>
      </View>
      <View style={styles.progressSection}>
        <View style={styles.xpRow}>
          <Text style={styles.xpLabel}>XP Progress</Text>
          <Text style={styles.xpValue}>{userLevel.xp.toLocaleString()} XP</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: tierColor }]} />
        </View>
        <Text style={styles.nextLevel}>{progress}% to Level {userLevel.level + 1}</Text>
      </View>
      <View style={styles.coins}>
        <Text style={styles.coinText}>💰 {userLevel.coins.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center' },
  levelBadge: { alignItems: 'center', marginRight: 16 },
  tierEmoji: { fontSize: 24 },
  level: { fontSize: 32, fontWeight: '800' },
  tierName: { fontSize: 10, color: '#999', fontWeight: '600' },
  progressSection: { flex: 1 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  xpLabel: { fontSize: 12, color: '#666' },
  xpValue: { fontSize: 12, fontWeight: '600' },
  progressBar: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: 4 },
  nextLevel: { fontSize: 11, color: '#999' },
  coins: { marginLeft: 12 },
  coinText: { fontSize: 14, fontWeight: '600' },
});
