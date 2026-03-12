import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { LeaderboardEntry } from '../../types';

interface Props { entries: LeaderboardEntry[]; currentUserId: string }

const RANK_EMOJIS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const Leaderboard: React.FC<Props> = ({ entries, currentUserId }) => (
  <View>
    <Text style={styles.title}>🏆 Leaderboard</Text>
    <FlatList
      data={entries}
      keyExtractor={(e) => e.userId}
      renderItem={({ item }) => (
        <View style={[styles.row, item.userId === currentUserId && styles.highlight]}>
          <Text style={styles.rank}>{RANK_EMOJIS[item.rank] ?? `#${item.rank}`}</Text>
          <Text style={styles.name}>{item.username}</Text>
          <Text style={styles.level}>Lv {item.level}</Text>
          <Text style={styles.score}>{item.score.toLocaleString()}</Text>
        </View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#16213E', borderRadius: 12, marginBottom: 6 },
  highlight: { borderColor: '#6C63FF', borderWidth: 1 },
  rank: { width: 32, fontSize: 16 },
  name: { flex: 1, color: '#fff' },
  level: { color: '#6C63FF', marginRight: 8, fontWeight: '600' },
  score: { color: '#FFC107', fontWeight: '700' },
});

export default Leaderboard;
