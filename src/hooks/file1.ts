import { useState, useEffect, useCallback } from 'react';
import { goalOperations } from '../services/database/operations';
import { Goal } from '../types';

const useGoals = (lifeAreaId?: string) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = lifeAreaId
        ? await goalOperations.getByLifeArea(lifeAreaId)
        : await goalOperations.getAll();
      setGoals(data);
    } catch (e) {
      setError('Failed to load goals.');
    } finally {
      setLoading(false);
    }
  }, [lifeAreaId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const completeGoal = useCallback(async (id: string) => {
    try {
      await goalOperations.markComplete(id);
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: true } : g)));
    } catch (e) {
      setError('Failed to complete goal.');
    }
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    try {
      await goalOperations.delete(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (e) {
      setError('Failed to delete goal.');
    }
  }, []);

  return { goals, loading, error, refetch: fetchGoals, completeGoal, deleteGoal };
};

export default useGoals;