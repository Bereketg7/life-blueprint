import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { xp: number; coins: number; badge?: string; visible: boolean }

const QuestRewardAnimation: React.FC<Props> = ({ xp, coins, badge, visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Quest Complete!</Text>
      <Text style={styles.reward}>+{xp} XP  |  +{coins} coins{badge ? `  |  🏅 ${badge}` : ''}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 999 },
  emoji: { fontSize: 64 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 8 },
  reward: { color: '#FFC107', fontSize: 18, marginTop: 8 },
});

export default QuestRewardAnimation;
