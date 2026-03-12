import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Recommendation } from '../../types';

const TYPE_EMOJIS: Record<Recommendation['type'], string> = {
  workout: '💪', meal: '🥗', rest: '😴', hydration: '💧', meditation: '🧘',
};

interface Props {
  recommendation: Recommendation;
  onAccept: () => void;
  onReject: () => void;
}

const RecommendationCard: React.FC<Props> = ({ recommendation: rec, onAccept, onReject }) => (
  <View style={styles.card}>
    <Text style={styles.emoji}>{TYPE_EMOJIS[rec.type]}</Text>
    <View style={styles.content}>
      <Text style={styles.title}>{rec.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{rec.description}</Text>
      <Text style={styles.reason}>{rec.reason}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.accept} onPress={onAccept}>
          <Text style={styles.acceptText}>✓ Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reject} onPress={onReject}>
          <Text style={styles.rejectText}>✕ Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#16213E', borderRadius: 16, padding: 16, flexDirection: 'row', marginBottom: 12 },
  emoji: { fontSize: 32, marginRight: 12 },
  content: { flex: 1 },
  title: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 4 },
  description: { color: '#B0B0CC', fontSize: 13, marginBottom: 4 },
  reason: { color: '#6C63FF', fontSize: 11, marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 8 },
  accept: { flex: 1, backgroundColor: '#6C63FF', borderRadius: 8, padding: 8, alignItems: 'center' },
  acceptText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  reject: { flex: 1, backgroundColor: '#2A2A4A', borderRadius: 8, padding: 8, alignItems: 'center' },
  rejectText: { color: '#B0B0CC', fontSize: 12 },
});

export default RecommendationCard;
