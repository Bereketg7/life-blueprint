import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Plan } from '../types';

interface PlanContextType {
  plans: Plan[];
  setPlans: (plans: Plan[]) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  return <PlanContext.Provider value={{ plans, setPlans }}>{children}</PlanContext.Provider>;
};

export const usePlan = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
