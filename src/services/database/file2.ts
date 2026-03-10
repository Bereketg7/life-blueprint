import { lifeAreaOperations } from './operations';
import { LifeArea } from '../../types';

const DEFAULT_LIFE_AREAS: LifeArea[] = [
  { id: '1', name: 'Health', description: 'Physical and mental well-being', color: '#4CAF50' },
  { id: '2', name: 'Career', description: 'Professional growth and achievements', color: '#2196F3' },
  { id: '3', name: 'Finances', description: 'Financial health and wealth building', color: '#FF9800' },
  { id: '4', name: 'Relationships', description: 'Family, friends, and social connections', color: '#E91E63' },
  { id: '5', name: 'Education', description: 'Learning and personal development', color: '#9C27B0' },
  { id: '6', name: 'Spirituality', description: 'Inner peace and purpose', color: '#00BCD4' },
];

export async function seedDefaultLifeAreas(): Promise<void> {
  const existing = await lifeAreaOperations.getAll();
  if (existing.length === 0) {
    for (const area of DEFAULT_LIFE_AREAS) {
      await lifeAreaOperations.create(area);
    }
  }
}

export function getDefaultLifeAreas(): LifeArea[] {
  return DEFAULT_LIFE_AREAS;
}