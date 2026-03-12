import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BattlePass } from '../../types';
import { BATTLE_PASS_XP_PER_LEVEL, BATTLE_PASS_LEVELS } from '../../services/gamification/battlePassSystem';

interface Props { battlePass: BattlePass }

const BattlePassProgress: React.FC<Props> = ({ battlePass }) => {
  const pct = Math.min(100, Math.round(((battlePass.xp % BATTLE_PASS_XP_PER_LEVEL) / BATTLE_PASS_XP_PER_LEVEL) * 100));
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.level}>Level {battlePass.level}</Text>
        <Text style={styles.track}>{battlePass.track === 'premium' ? '⭐ Premium' : 'Free'}</Text>
        <Text style={styles.maxLevel}>/ {BATTLE_PASS_LEVELS}</Text>
      </View>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.xpText}>{battlePass.xp % BATTLE_PASS_XP_PER_LEVEL} / {BATTLE_PASS_XP_PER_LEVEL} XP to next level</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#16213E', borderRadius: 16, padding: 16, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  level: { color: '#fff', fontWeight: '700', fontSize: 18, flex: 1 },
  track: { color: '#FFC107', fontWeight: '600' },
  maxLevel: { color: '#B0B0CC', marginLeft: 4 },
  bar: { backgroundColor: '#2A2A4A', borderRadius: 4, height: 8, overflow: 'hidden', marginBottom: 4 },
  fill: { backgroundColor: '#6C63FF', height: 8 },
  xpText: { color: '#B0B0CC', fontSize: 12 },
});

export default BattlePassProgress;
