import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { WeeklyPlan, UserProfile, DailyPlanItem } from '../types';
import { generateWeeklyPlan } from '../services/planGenerator';

interface PlanContextType {
  currentPlan: WeeklyPlan | null;
  allPlans: WeeklyPlan[];
  loading: boolean;
  generatePlan: (profile: UserProfile) => void;
  savePlan: (plan: WeeklyPlan) => void;
  loadCurrentPlan: () => void;
  updateItemStatus: (itemId: string, status: DailyPlanItem['status']) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null);
  const [allPlans, setAllPlans] = useState<WeeklyPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const generatePlan = useCallback((profile: UserProfile) => {
    setLoading(true);
    try {
      const plan = generateWeeklyPlan(profile);
      setCurrentPlan(plan);
      setAllPlans((prev) => [...prev, plan]);
    } finally {
      setLoading(false);
    }
  }, []);

  const savePlan = useCallback((plan: WeeklyPlan) => {
    setCurrentPlan(plan);
    setAllPlans((prev) => {
      const exists = prev.find((p) => p.id === plan.id);
      return exists ? prev.map((p) => (p.id === plan.id ? plan : p)) : [...prev, plan];
    });
  }, []);

  const loadCurrentPlan = useCallback(() => {
    if (allPlans.length > 0) {
      const sorted = [...allPlans].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setCurrentPlan(sorted[0]);
    }
  }, [allPlans]);

  const updateItemStatus = useCallback((itemId: string, status: DailyPlanItem['status']) => {
    const updateItems = (plan: WeeklyPlan): WeeklyPlan => ({
      ...plan,
      items: plan.items.map((item) => (item.id === itemId ? { ...item, status } : item)),
    });

    setCurrentPlan((prev) => (prev ? updateItems(prev) : prev));
    setAllPlans((prev) =>
      prev.map((plan) =>
        plan.items.some((item) => item.id === itemId) ? updateItems(plan) : plan
      )
    );
  }, []);

  return (
    <PlanContext.Provider value={{ currentPlan, allPlans, loading, generatePlan, savePlan, loadCurrentPlan, updateItemStatus }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
