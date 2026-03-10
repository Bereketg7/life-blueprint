import { useState, useEffect, useCallback } from 'react';
import { lifeAreaOperations } from '../services/database/operations';
import { LifeArea } from '../types';

const useLifeAreas = () => {
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLifeAreas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await lifeAreaOperations.getAll();
      setLifeAreas(data);
    } catch (e) {
      console.error('Failed to load life areas:', e);
      setError('Failed to load life areas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLifeAreas();
  }, [fetchLifeAreas]);

  return { lifeAreas, loading, error, refetch: fetchLifeAreas };
};

export default useLifeAreas;