import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getLevelTitle } from '../../services/gamification/levelingSystem';

interface Props { level: number; size?: 'sm' | 'md' | 'lg' }

const LevelBadge: React.FC<Props> = ({ level, size = 'md' }) => {
  const sz = size === 'lg' ? 56 : size === 'sm' ? 32 : 44;
  const fs = size === 'lg' ? 18 : size === 'sm' ? 10 : 14;
  return (
    <View style={[styles.badge, { width: sz, height: sz, borderRadius: sz / 2 }]}>
      <Text style={[styles.level, { fontSize: fs }]}>{level}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center' },
  level: { color: '#fff', fontWeight: '700' },
});

export default LevelBadge;
