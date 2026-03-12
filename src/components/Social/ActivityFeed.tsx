import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { CommunityPost } from '../../types';

interface Props { posts: CommunityPost[]; onLike: (id: string) => void }

const ActivityFeed: React.FC<Props> = ({ posts, onLike }) => (
  <FlatList
    data={posts}
    keyExtractor={(p) => p.id}
    renderItem={({ item }) => (
      <View style={styles.post}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{item.userName[0]}</Text></View>
        <View style={styles.content}>
          <Text style={styles.name}>{item.userName}</Text>
          <Text style={styles.text}>{item.content}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onLike(item.id)} style={styles.likeBtn}>
              <Text style={styles.likeText}>❤️ {item.likes}</Text>
            </TouchableOpacity>
            <Text style={styles.time}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
    )}
    ListEmptyComponent={<Text style={styles.empty}>No activity yet.</Text>}
  />
);

const styles = StyleSheet.create({
  post: { flexDirection: 'row', backgroundColor: '#16213E', borderRadius: 16, padding: 12, marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: '700' },
  content: { flex: 1 },
  name: { color: '#fff', fontWeight: '600' },
  text: { color: '#B0B0CC', fontSize: 13, marginVertical: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  likeBtn: { padding: 4 },
  likeText: { color: '#FF6B6B', fontSize: 12 },
  time: { color: '#6B6B8A', fontSize: 11 },
  empty: { color: '#B0B0CC', textAlign: 'center', padding: 24 },
});

export default ActivityFeed;
