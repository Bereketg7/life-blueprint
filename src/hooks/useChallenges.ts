import { useState, useCallback } from 'react';
import { SocialChallenge } from '../types';
import {
  createChallenge,
  joinChallenge,
  getActiveChallengees,
  getAllChallenges,
} from '../services/social/challengeService';

export function useChallenges(userId: string) {
  const [activeChallenges, setActiveChallenges] = useState<SocialChallenge[]>(() =>
    getActiveChallengees(userId)
  );
  const [allChallenges] = useState<SocialChallenge[]>(() => getAllChallenges());

  const create = useCallback(
    (
      title: string,
      description: string,
      type: SocialChallenge['type'],
      goal: number,
      durationDays: number
    ) => {
      const challenge = createChallenge(userId, title, description, type, goal, durationDays);
      setActiveChallenges(getActiveChallengees(userId));
      return challenge;
    },
    [userId]
  );

  const join = useCallback(
    (challengeId: string) => {
      const challenge = joinChallenge(challengeId, userId);
      setActiveChallenges(getActiveChallengees(userId));
      return challenge;
    },
    [userId]
  );

  const refresh = useCallback(() => {
    setActiveChallenges(getActiveChallengees(userId));
  }, [userId]);

  return {
    activeChallenges,
    allChallenges,
    createChallenge: create,
    joinChallenge: join,
    refresh,
  };
}
