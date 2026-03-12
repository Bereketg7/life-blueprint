/** Minimal coach personality configuration store (in-memory, no external DB). */

import { CoachPersonalityConfig } from '../../types';

const DEFAULT_PERSONALITY: Omit<CoachPersonalityConfig, 'userId'> = {
  style: 'motivating',
  name: 'Alex',
  tone: 'friendly and encouraging',
  focusAreas: ['fitness', 'nutrition', 'sleep'],
  updatedAt: new Date().toISOString(),
};

const store = new Map<string, CoachPersonalityConfig>();

export function getPersonality(userId: string): CoachPersonalityConfig {
  return (
    store.get(userId) ?? {
      userId,
      ...DEFAULT_PERSONALITY,
    }
  );
}

export async function updatePersonality(
  userId: string,
  config: Partial<Omit<CoachPersonalityConfig, 'userId'>>,
): Promise<void> {
  const existing = getPersonality(userId);
  store.set(userId, {
    ...existing,
    ...config,
    userId,
    updatedAt: new Date().toISOString(),
  });
}

export const STYLE_DESCRIPTIONS: Record<
  CoachPersonalityConfig['style'],
  string
> = {
  motivating:
    "Energetic and upbeat, celebrates every win and pushes you past your limits.",
  analytical:
    "Data-driven and precise, focuses on metrics, trends and evidence-based strategies.",
  supportive:
    "Empathetic and patient, meets you where you are and builds your confidence gradually.",
  challenging:
    "High-expectation and direct, pushes you beyond your comfort zone to unlock real growth.",
};
