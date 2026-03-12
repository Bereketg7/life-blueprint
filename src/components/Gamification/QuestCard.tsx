import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Quest } from '../../types';

interface Props {
  quest: Quest;
  onUpdateProgress?: (questId: string, amount: number) => void;
}

const DIFFICULTY_COLORS = ['#808080', '#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'];
const DIFFICULTY_LABELS = ['', 'Easy', 'Medium', 'Hard', 'Expert', 'Legendary'];

export default function QuestCard({ quest, onUpdateProgress }: Props) {
  const progress = quest.target > 0 ? (quest.current / quest.target) * 100 : 0;
  const color = DIFFICULTY_COLORS[quest.difficulty] ?? '#4CAF50';

  return (
    <View style={[styles.card, quest.status === 'completed' && styles.completed]}>
      <View style={styles.header}>
        <Text style={styles.title}>{quest.title}</Text>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{DIFFICULTY_LABELS[quest.difficulty]}</Text>
        </View>
      </View>
      <Text style={styles.description}>{quest.description}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(100, progress)}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.progressText}>{quest.current}/{quest.target}</Text>
      </View>
      <View style={styles.reward}>
        <Text style={styles.rewardText}>⚡ {quest.reward.xp} XP  💰 {quest.reward.coins}</Text>
      </View>
      {quest.status === 'active' && onUpdateProgress && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: color }]}
          onPress={() => onUpdateProgress(quest.id, 1)}
        >
          <Text style={styles.buttonText}>Log Progress</Text>
        </TouchableOpacity>
      )}
      {quest.status === 'completed' && (
        <Text style={styles.completedText}>✅ Completed!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginVertical: 6, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  completed: { opacity: 0.7 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '600', flex: 1 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  description: { fontSize: 13, color: '#666', marginBottom: 10 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginRight: 8 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#999' },
  reward: { marginBottom: 8 },
  rewardText: { fontSize: 12, color: '#888' },
  button: { borderRadius: 8, padding: 10, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  completedText: { textAlign: 'center', color: '#4CAF50', fontWeight: '600', fontSize: 14 },
});
