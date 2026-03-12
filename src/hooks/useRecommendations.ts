import { useState, useCallback } from 'react';
import { Recommendation } from '../types';
import { generateRecommendations, recordRecommendationResponse, getAcceptanceRate } from '../services/recommendations';
import { ActivityLog, SleepLog, NutritionLog, MentalHealthLog } from '../types';

type LogBundle = {
  activity: ActivityLog[];
  sleep: SleepLog[];
  nutrition: NutritionLog[];
  mental: MentalHealthLog[];
};

export function useRecommendations(logs: LogBundle) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const recs = generateRecommendations(logs);
      setRecommendations(recs);
    } finally {
      setLoading(false);
    }
  }, [logs]);

  const accept = useCallback((id: string) => {
    recordRecommendationResponse(id, true);
    setRecommendations(prev => prev.filter(r => r.id !== id));
  }, []);

  const reject = useCallback((id: string) => {
    recordRecommendationResponse(id, false);
    setRecommendations(prev => prev.filter(r => r.id !== id));
  }, []);

  return { recommendations, loading, refresh, accept, reject, acceptanceRate: getAcceptanceRate() };
}
