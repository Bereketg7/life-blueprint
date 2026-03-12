// Social challenge service
import { SocialChallenge } from '../../types';

const _challenges: SocialChallenge[] = [];

function generateId(): string {
  return `challenge_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function createChallenge(
  createdBy: string,
  title: string,
  description: string,
  type: SocialChallenge['type'],
  goal: number,
  durationDays: number
): SocialChallenge {
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const challenge: SocialChallenge = {
    id: generateId(),
    createdBy,
    participants: [createdBy],
    title,
    description,
    type,
    goal,
    duration: durationDays,
    startDate,
    endDate,
    status: 'active',
  };

  _challenges.push(challenge);
  return challenge;
}

export function joinChallenge(challengeId: string, userId: string): SocialChallenge | null {
  const challenge = _challenges.find((c) => c.id === challengeId);
  if (!challenge || challenge.participants.includes(userId)) return challenge ?? null;
  challenge.participants = [...challenge.participants, userId];
  return challenge;
}

export function getActiveChallengees(userId: string): SocialChallenge[] {
  return _challenges.filter(
    (c) => c.status === 'active' && c.participants.includes(userId)
  );
}

export function getAllChallenges(): SocialChallenge[] {
  return [..._challenges];
}

export function completeChallenge(challengeId: string): void {
  const challenge = _challenges.find((c) => c.id === challengeId);
  if (challenge) challenge.status = 'completed';
}
