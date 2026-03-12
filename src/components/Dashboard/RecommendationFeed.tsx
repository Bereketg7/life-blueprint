import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Recommendation } from '../../types';
import RecommendationCard from './RecommendationCard';

interface Props {
  recommendations: Recommendation[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const RecommendationFeed: React.FC<Props> = ({ recommendations, onAccept, onReject }) => (
  <View>
    <Text style={styles.heading}>AI Recommendations</Text>
    {recommendations.length === 0
      ? <Text style={styles.empty}>No recommendations yet. Keep logging your data!</Text>
      : recommendations.map((rec) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            onAccept={() => onAccept(rec.id)}
            onReject={() => onReject(rec.id)}
          />
        ))}
  </View>
);

const styles = StyleSheet.create({
  heading: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  empty: { color: '#B0B0CC', textAlign: 'center', padding: 24 },
});

export default RecommendationFeed;
