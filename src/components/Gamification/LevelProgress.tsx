import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserLevel } from '../../types';

interface Props { userLevel: UserLevel }

const LevelProgress: React.FC<Props> = ({ userLevel }) => {
  const pct = userLevel.xpToNextLevel > 0
    ? Math.round((userLevel.currentXp / (userLevel.currentXp + userLevel.xpToNextLevel)) * 100)
    : 100;
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.level}>Lv {userLevel.level}</Text>
        <Text style={styles.xp}>{userLevel.currentXp} / {userLevel.currentXp + userLevel.xpToNextLevel} XP</Text>
      </View>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#16213E', borderRadius: 12, padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  level: { color: '#6C63FF', fontWeight: '700', fontSize: 14 },
  xp: { color: '#B0B0CC', fontSize: 12 },
  bar: { backgroundColor: '#2A2A4A', borderRadius: 4, height: 6, overflow: 'hidden' },
  fill: { backgroundColor: '#6C63FF', height: 6 },
});

export default LevelProgress;
