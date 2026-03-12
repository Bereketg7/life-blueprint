import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Quest } from '../../types';
import QuestCard from './QuestCard';

interface Props { quests: Quest[]; onUpdateProgress: (id: string, progress: number) => void }

const DailyQuests: React.FC<Props> = ({ quests, onUpdateProgress }) => (
  <View>
    <Text style={styles.title}>🎯 Daily Quests</Text>
    {quests.map((q) => <QuestCard key={q.id} quest={q} onComplete={() => onUpdateProgress(q.id, q.target)} />)}
  </View>
);

const styles = StyleSheet.create({
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
});

export default DailyQuests;
