import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { BattlePass, SeasonalReward } from '../../types';

interface Props {
  battlePass: BattlePass;
  onUpgrade?: () => void;
}

function RewardItem({ reward, unlocked }: { reward: SeasonalReward; unlocked: boolean }) {
  return (
    <View style={[styles.rewardItem, unlocked && styles.unlockedReward]}>
      <Text style={styles.rewardIcon}>{reward.icon}</Text>
      {reward.isPremium && <Text style={styles.premiumBadge}>★</Text>}
      {!unlocked && <View style={styles.lockedOverlay}><Text style={styles.lockIcon}>🔒</Text></View>}
    </View>
  );
}

export default function BattlePassViewer({ battlePass, onUpgrade }: Props) {
  const freeTiers = battlePass.rewards.filter(r => !r.isPremium).slice(0, 10);
  const premiumTiers = battlePass.rewards.filter(r => r.isPremium).slice(0, 10);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Season {battlePass.season} Battle Pass</Text>
        <Text style={styles.tier}>Tier {battlePass.tier}/50</Text>
      </View>

      {!battlePass.isPremium && (
        <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
          <Text style={styles.upgradeText}>⭐ Upgrade to Premium</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.trackLabel}>Free Track</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.track}>
          {freeTiers.map(reward => (
            <RewardItem
              key={reward.id}
              reward={reward}
              unlocked={!!reward.unlockedAt}
            />
          ))}
        </View>
      </ScrollView>

      <Text style={styles.trackLabel}>Premium Track</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.track}>
          {premiumTiers.map(reward => (
            <RewardItem
              key={reward.id}
              reward={reward}
              unlocked={battlePass.isPremium && !!reward.unlockedAt}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(battlePass.progress / 500) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{battlePass.progress}/500 XP to next tier</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  tier: { color: '#FFD700', fontSize: 16, fontWeight: '600' },
  upgradeButton: { backgroundColor: '#FFD700', borderRadius: 8, padding: 10, alignItems: 'center', marginBottom: 12 },
  upgradeText: { color: '#000', fontWeight: '700', fontSize: 14 },
  trackLabel: { color: '#aaa', fontSize: 12, marginBottom: 6, marginTop: 8 },
  track: { flexDirection: 'row', gap: 8 },
  rewardItem: { width: 60, height: 60, backgroundColor: '#2d2d44', borderRadius: 8, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  unlockedReward: { backgroundColor: '#3d3d64', borderWidth: 1, borderColor: '#FFD700' },
  rewardIcon: { fontSize: 24 },
  premiumBadge: { position: 'absolute', top: 2, right: 4, color: '#FFD700', fontSize: 10 },
  lockedOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  lockIcon: { fontSize: 16 },
  progressBar: { height: 6, backgroundColor: '#2d2d44', borderRadius: 3, overflow: 'hidden', marginTop: 12 },
  progressFill: { height: '100%', backgroundColor: '#FFD700', borderRadius: 3 },
  progressText: { color: '#aaa', fontSize: 11, marginTop: 4, textAlign: 'right' },
});
