import { useState, useCallback } from 'react';
import { Recommendation, RecommendationResponse } from '../types';
import { generateRecommendations, RecentLogs } from '../services/recommendations/engine';

type UseRecommendationsResult = {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  refresh: (userProfile: any, recentLogs: RecentLogs) => Promise<void>;
  dismissRecommendation: (id: string) => void;
  acceptRecommendation: (id: string) => void;
};

export function useRecommendations(
  userProfile: any,
  recentLogs: RecentLogs,
): UseRecommendationsResult {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (profile = userProfile, logs = recentLogs) => {
      setLoading(true);
      setError(null);
      try {
        const response: RecommendationResponse = await generateRecommendations(
          profile,
          logs,
        );
        setRecommendations(response.recommendations);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to generate recommendations',
        );
      } finally {
        setLoading(false);
      }
    },
    [userProfile, recentLogs],
  );

  const dismissRecommendation = useCallback((id: string) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'dismissed' as const } : r,
      ),
    );
  }, []);

  const acceptRecommendation = useCallback((id: string) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'accepted' as const } : r,
      ),
    );
  }, []);

  return {
    recommendations,
    loading,
    error,
    refresh,
    dismissRecommendation,
    acceptRecommendation,
  };
}

export default useRecommendations;
