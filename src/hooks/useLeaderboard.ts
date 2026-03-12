import { useState, useCallback } from 'react';
import { LeaderboardEntry } from '../types';
import {
  getGlobalLeaderboard,
  getFriendsLeaderboard,
  getUserRank,
  upsertLeaderboardEntry,
} from '../services/social/leaderboardService';

export function useLeaderboard(userId: string) {
  const [globalBoard, setGlobalBoard] = useState<LeaderboardEntry[]>(() =>
    getGlobalLeaderboard()
  );
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(() =>
    getUserRank(userId)
  );

  const refresh = useCallback(() => {
    setGlobalBoard(getGlobalLeaderboard());
    setUserRank(getUserRank(userId));
  }, [userId]);

  const updateScore = useCallback(
    (entry: Omit<LeaderboardEntry, 'rank'>) => {
      upsertLeaderboardEntry(entry);
      refresh();
    },
    [refresh]
  );

  const getFriendBoard = useCallback(
    (friendIds: string[]) => {
      return getFriendsLeaderboard(userId, friendIds);
    },
    [userId]
  );

  return {
    globalBoard,
    userRank,
    refresh,
    updateScore,
    getFriendBoard,
  };
}
