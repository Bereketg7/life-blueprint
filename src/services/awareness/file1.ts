import { awarenessOperations } from '../database/operations';
import { AwarenessEntry } from '../../types';

export function createAwarenessEntry(
  lifeAreaId: string,
  score: number,
  note: string
): AwarenessEntry {
  return {
    id: `awareness_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    lifeAreaId,
    score: Math.max(1, Math.min(10, score)),
    note,
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };
}

export async function trackAwareness(
  lifeAreaId: string,
  score: number,
  note: string
): Promise<AwarenessEntry> {
  const entry = createAwarenessEntry(lifeAreaId, score, note);
  await awarenessOperations.create(entry);
  return entry;
}

export async function getAwarenessHistory(lifeAreaId: string): Promise<AwarenessEntry[]> {
  return awarenessOperations.getByLifeArea(lifeAreaId);
}