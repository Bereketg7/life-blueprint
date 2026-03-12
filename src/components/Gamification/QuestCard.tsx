import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Quest } from '../../types';

const TYPE_EMOJIS: Record<Quest['type'], string> = {
  workout: '💪', nutrition: '🥗', water: '💧', sleep: '😴', meditation: '🧘',
};
const DIFFICULTY_COLORS: Record<Quest['difficulty'], string> = {
  easy: '#4CAF50', medium: '#FFC107', hard: '#FF6B6B',
};

interface Props { quest: Quest; onComplete: () => void }

const QuestCard: React.FC<Props> = ({ quest, onComplete }) => (
  <View style={[styles.card, quest.status === 'completed' && styles.completed]}>
    <Text style={styles.emoji}>{TYPE_EMOJIS[quest.type]}</Text>
    <View style={styles.info}>
      <Text style={styles.title}>{quest.title}</Text>
      <Text style={styles.desc}>{quest.description}</Text>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${Math.round((quest.current / quest.target) * 100)}%` }]} />
      </View>
      <Text style={styles.progress}>{quest.current}/{quest.target}</Text>
    </View>
    <View style={styles.right}>
      <Text style={[styles.diff, { color: DIFFICULTY_COLORS[quest.difficulty] }]}>{quest.difficulty}</Text>
      <Text style={styles.reward}>+{quest.reward.xp} XP</Text>
      {quest.status === 'pending' && (
        <TouchableOpacity style={styles.btn} onPress={onComplete}>
          <Text style={styles.btnText}>Done</Text>
        </TouchableOpacity>
      )}
      {quest.status === 'completed' && <Text style={styles.check}>✓</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#16213E', borderRadius: 16, padding: 16, flexDirection: 'row', marginBottom: 8 },
  completed: { opacity: 0.6 },
  emoji: { fontSize: 28, marginRight: 12 },
  info: { flex: 1 },
  title: { color: '#fff', fontWeight: '700', fontSize: 14 },
  desc: { color: '#B0B0CC', fontSize: 12, marginBottom: 8 },
  progressBg: { backgroundColor: '#2A2A4A', borderRadius: 4, height: 4, overflow: 'hidden' },
  progressFill: { backgroundColor: '#6C63FF', height: 4 },
  progress: { color: '#6B6B8A', fontSize: 11, marginTop: 2 },
  right: { alignItems: 'center', gap: 4 },
  diff: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  reward: { color: '#FFC107', fontSize: 12, fontWeight: '600' },
  btn: { backgroundColor: '#6C63FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  check: { color: '#4CAF50', fontSize: 20, fontWeight: '700' },
});

export default QuestCard;
