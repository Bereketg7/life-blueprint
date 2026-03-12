import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SeasonalReward } from '../../types';

interface Props { rewards: SeasonalReward[]; claimedIds: string[]; currentLevel: number }

const SeasonalRewards: React.FC<Props> = ({ rewards, claimedIds, currentLevel }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {rewards.map((r) => {
      const claimed = claimedIds.includes(r.id);
      const locked = r.level > currentLevel;
      return (
        <View key={r.id} style={[styles.tile, locked && styles.locked, claimed && styles.claimed]}>
          <Text style={styles.level}>{r.level}</Text>
          <Text style={styles.reward}>{r.reward}</Text>
          <Text style={styles.type}>{r.type}</Text>
          {claimed && <Text style={styles.claimedBadge}>✓</Text>}
          {locked && <Text style={styles.lockBadge}>🔒</Text>}
        </View>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  tile: { backgroundColor: '#16213E', borderRadius: 12, padding: 12, width: 80, marginRight: 8, alignItems: 'center' },
  locked: { opacity: 0.4 },
  claimed: { borderColor: '#4CAF50', borderWidth: 2 },
  level: { color: '#6C63FF', fontWeight: '700', fontSize: 12 },
  reward: { color: '#fff', fontSize: 10, textAlign: 'center', marginVertical: 4 },
  type: { color: '#B0B0CC', fontSize: 9, textTransform: 'capitalize' },
  claimedBadge: { color: '#4CAF50', fontSize: 16 },
  lockBadge: { fontSize: 14 },
});

export default SeasonalRewards;
