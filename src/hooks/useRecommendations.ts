import { useState, useCallback } from 'react';
import { Recommendation } from '../types';
import { generateRecommendations, UserHealthSnapshot } from '../services/recommendations/engine';

export function useRecommendations(userId: string) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(
    async (snapshot: Omit<UserHealthSnapshot, 'userId'>) => {
      setLoading(true);
      try {
        const recs = generateRecommendations({ ...snapshot, userId });
        setRecommendations(recs);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const respondToRecommendation = useCallback(
    (id: string, response: 'accepted' | 'rejected') => {
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, userResponse: response } : r))
      );
    },
    []
  );

  const pendingRecommendations = recommendations.filter((r) => r.userResponse === 'pending');
  const acceptedRecommendations = recommendations.filter((r) => r.userResponse === 'accepted');

  return {
    recommendations,
    pendingRecommendations,
    acceptedRecommendations,
    loading,
    refresh,
    respondToRecommendation,
  };
}
