import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SeasonChallenge { title: string; description: string; xpReward: number; completed: boolean }
interface Props { challenge: SeasonChallenge; onComplete: () => void }

const SeasonalChallenge: React.FC<Props> = ({ challenge, onComplete }) => (
  <View style={[styles.card, challenge.completed && styles.done]}>
    <Text style={styles.title}>{challenge.title}</Text>
    <Text style={styles.desc}>{challenge.description}</Text>
    <View style={styles.row}>
      <Text style={styles.xp}>+{challenge.xpReward} BP XP</Text>
      {!challenge.completed && (
        <TouchableOpacity style={styles.btn} onPress={onComplete}>
          <Text style={styles.btnText}>Complete</Text>
        </TouchableOpacity>
      )}
      {challenge.completed && <Text style={styles.check}>✓ Done</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#16213E', borderRadius: 12, padding: 16, marginBottom: 8 },
  done: { opacity: 0.6 },
  title: { color: '#fff', fontWeight: '700' },
  desc: { color: '#B0B0CC', fontSize: 12, marginVertical: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xp: { color: '#FFC107', fontWeight: '600' },
  btn: { backgroundColor: '#6C63FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  check: { color: '#4CAF50', fontWeight: '700' },
});

export default SeasonalChallenge;
