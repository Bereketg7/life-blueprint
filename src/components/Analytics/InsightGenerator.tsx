import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { insights: string[] }

const InsightGenerator: React.FC<Props> = ({ insights }) => (
  <View style={styles.container}>
    <Text style={styles.title}>💡 AI Insights</Text>
    {insights.length === 0
      ? <Text style={styles.empty}>Keep logging data to generate insights.</Text>
      : insights.map((insight, i) => (
          <View key={i} style={styles.insight}>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.text}>{insight}</Text>
          </View>
        ))}
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#16213E', borderRadius: 16, padding: 16 },
  title: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  empty: { color: '#B0B0CC', fontStyle: 'italic' },
  insight: { flexDirection: 'row', marginBottom: 8 },
  dot: { color: '#6C63FF', marginRight: 8, fontSize: 16 },
  text: { color: '#B0B0CC', flex: 1, fontSize: 13 },
});

export default InsightGenerator;
