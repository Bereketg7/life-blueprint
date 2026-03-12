import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFriends } from '../hooks/useFriends';
import ActivityFeed from '../components/Social/ActivityFeed';

export default function SocialScreen() {
  const [userId] = useState('current_user');
  const { friends, challenges, feed, addFriend, startChallenge } = useFriends(userId);
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'challenges'>('feed');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
      </View>

      <View style={styles.tabs}>
        {(['feed', 'friends', 'challenges'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'feed' && (
          <ActivityFeed feed={feed} />
        )}
        {activeTab === 'friends' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>You have {friends.length} friend{friends.length !== 1 ? 's' : ''}</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => addFriend('friend_1', 'Alex Johnson')}>
              <Text style={styles.actionButtonText}>+ Add Friend</Text>
            </TouchableOpacity>
          </View>
        )}
        {activeTab === 'challenges' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyText}>{challenges.length} active challenge{challenges.length !== 1 ? 's' : ''}</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => startChallenge('steps', '30-Day Step Challenge')}>
              <Text style={styles.actionButtonText}>+ Create Challenge</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#4F86F7', padding: 16, paddingTop: 50 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#4F86F7' },
  tabText: { fontSize: 14, color: '#666' },
  activeTabText: { color: '#4F86F7', fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 16 },
  actionButton: { backgroundColor: '#4F86F7', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  actionButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
