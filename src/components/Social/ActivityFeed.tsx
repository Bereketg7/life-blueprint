import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ActivityFeedItem } from '../../types';

const TYPE_ICONS: Record<ActivityFeedItem['type'], string> = {
  workout: '🏋️',
  achievement: '🏅',
  quest: '⚔️',
  level_up: '⬆️',
  challenge: '🏆',
};

function FeedItemCard({ item }: { item: ActivityFeedItem }) {
  const timeAgo = (() => {
    const diff = Date.now() - new Date(item.timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();

  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{TYPE_ICONS[item.type]}</Text>
      <View style={styles.content}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <Text style={styles.time}>{timeAgo}</Text>
    </View>
  );
}

interface Props {
  feed: ActivityFeedItem[];
}

export default function ActivityFeed({ feed }: Props) {
  return (
    <FlatList
      data={feed}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <FeedItemCard item={item} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No activity yet. Add friends to see their updates!</Text>
        </View>
      }
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginVertical: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  icon: { fontSize: 28, marginRight: 12, alignSelf: 'center' },
  content: { flex: 1 },
  userName: { fontWeight: '700', fontSize: 13, color: '#333' },
  title: { fontSize: 14, fontWeight: '600', color: '#111', marginTop: 2 },
  description: { fontSize: 13, color: '#666', marginTop: 2 },
  time: { fontSize: 11, color: '#bbb', alignSelf: 'flex-start' },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#999', fontSize: 14, textAlign: 'center' },
});
