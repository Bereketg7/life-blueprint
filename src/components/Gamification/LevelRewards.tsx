import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getUpcomingUnlockables } from '../../services/gamification/unlockables';

interface Props { currentLevel: number }

const LevelRewards: React.FC<Props> = ({ currentLevel }) => {
  const upcoming = getUpcomingUnlockables(currentLevel, 5);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Unlocks</Text>
      {upcoming.map((u) => (
        <View key={u.id} style={styles.item}>
          <Text style={styles.level}>Lv {u.requiredLevel}</Text>
          <View style={styles.info}>
            <Text style={styles.name}>{u.name}</Text>
            <Text style={styles.desc}>{u.description}</Text>
          </View>
          <Text style={styles.type}>{u.type}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#16213E', borderRadius: 16, padding: 16 },
  title: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  level: { color: '#6C63FF', fontWeight: '700', width: 48, fontSize: 12 },
  info: { flex: 1 },
  name: { color: '#fff', fontWeight: '600' },
  desc: { color: '#B0B0CC', fontSize: 12 },
  type: { color: '#B0B0CC', fontSize: 10, textTransform: 'uppercase' },
});

export default LevelRewards;
