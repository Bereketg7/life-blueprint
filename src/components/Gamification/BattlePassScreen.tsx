import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { BattlePass, SeasonalReward } from '../../types';
import BattlePassProgress from './BattlePassProgress';

interface Props {
  battlePass: BattlePass | null;
  availableRewards: SeasonalReward[];
  daysRemaining: number;
  onActivate: (track: 'free' | 'premium') => void;
  onClaimReward: (id: string) => void;
}

const BattlePassScreen: React.FC<Props> = ({ battlePass, availableRewards, daysRemaining, onActivate, onClaimReward }) => (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>⚔️ Battle Pass</Text>
    <Text style={styles.days}>{daysRemaining} days remaining in season</Text>
    {battlePass
      ? <BattlePassProgress battlePass={battlePass} />
      : (
        <View style={styles.activate}>
          <TouchableOpacity style={styles.freeBtn} onPress={() => onActivate('free')}>
            <Text style={styles.freeBtnText}>Activate Free Pass</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.premBtn} onPress={() => onActivate('premium')}>
            <Text style={styles.premBtnText}>⭐ Go Premium</Text>
          </TouchableOpacity>
        </View>
      )}
    {availableRewards.length > 0 && (
      <View style={styles.rewards}>
        <Text style={styles.rewardsTitle}>🎁 Claim Rewards</Text>
        {availableRewards.map((r) => (
          <TouchableOpacity key={r.id} style={styles.rewardItem} onPress={() => onClaimReward(r.id)}>
            <Text style={styles.rewardText}>Lv {r.level}: {r.reward}</Text>
            <Text style={styles.claimText}>Claim</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A', padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  days: { color: '#B0B0CC', marginBottom: 16 },
  activate: { gap: 8 },
  freeBtn: { backgroundColor: '#16213E', borderRadius: 12, padding: 16, alignItems: 'center' },
  freeBtnText: { color: '#fff', fontWeight: '600' },
  premBtn: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 16, alignItems: 'center' },
  premBtnText: { color: '#fff', fontWeight: '700' },
  rewards: { marginTop: 24 },
  rewardsTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  rewardItem: { backgroundColor: '#16213E', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rewardText: { color: '#fff' },
  claimText: { color: '#FFC107', fontWeight: '700' },
});

export default BattlePassScreen;
