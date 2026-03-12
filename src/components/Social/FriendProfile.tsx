import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Friend } from '../../types';

interface Props { friend: Friend }

const FriendProfile: React.FC<Props> = ({ friend }) => (
  <View style={styles.container}>
    <View style={styles.avatar}><Text style={styles.avatarText}>{friend.username[0].toUpperCase()}</Text></View>
    <Text style={styles.name}>{friend.username}</Text>
    <View style={styles.stats}>
      <View style={styles.statItem}><Text style={styles.value}>{friend.level}</Text><Text style={styles.label}>Level</Text></View>
      <View style={styles.statItem}><Text style={styles.value}>{friend.streak}</Text><Text style={styles.label}>Streak</Text></View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  name: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 12 },
  stats: { flexDirection: 'row', gap: 32, marginTop: 16 },
  statItem: { alignItems: 'center' },
  value: { color: '#fff', fontSize: 24, fontWeight: '700' },
  label: { color: '#B0B0CC', fontSize: 12 },
});

export default FriendProfile;
