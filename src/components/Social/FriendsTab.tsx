import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Friend } from '../../types';

interface Props { friends: Friend[] }

const FriendsTab: React.FC<Props> = ({ friends }) => (
  <View style={styles.container}>
    <Text style={styles.title}>👥 Friends ({friends.length})</Text>
    <FlatList
      data={friends}
      keyExtractor={(f) => f.friendId}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.username}</Text>
          <Text style={styles.stats}>Lv {item.level}  🔥 {item.streak}</Text>
          <View style={[styles.dot, { backgroundColor: item.status === 'active' ? '#4CAF50' : '#6B6B8A' }]} />
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>Add friends to see them here!</Text>}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213E', borderRadius: 12, padding: 12, marginBottom: 8 },
  name: { color: '#fff', flex: 1 },
  stats: { color: '#B0B0CC', fontSize: 12, marginRight: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  empty: { color: '#B0B0CC', textAlign: 'center', padding: 24 },
});

export default FriendsTab;
