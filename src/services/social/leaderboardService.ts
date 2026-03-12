// Leaderboard service
import { LeaderboardEntry } from '../../types';

const _entries: LeaderboardEntry[] = [];

export function upsertLeaderboardEntry(entry: Omit<LeaderboardEntry, 'rank'>): void {
  const existing = _entries.findIndex((e) => e.userId === entry.userId);
  if (existing !== -1) {
    _entries[existing] = { ..._entries[existing], ...entry };
  } else {
    _entries.push({ ...entry, rank: 0 });
  }
  rebuildRanks();
}

function rebuildRanks(): void {
  _entries.sort((a, b) => b.score - a.score);
  _entries.forEach((e, i) => {
    e.rank = i + 1;
  });
}

export function getGlobalLeaderboard(limit: number = 50): LeaderboardEntry[] {
  return _entries.slice(0, limit);
}

export function getFriendsLeaderboard(
  userId: string,
  friendIds: string[]
): LeaderboardEntry[] {
  const relevantIds = [...friendIds, userId];
  return _entries.filter((e) => relevantIds.includes(e.userId));
}

export function getUserRank(userId: string): LeaderboardEntry | null {
  return _entries.find((e) => e.userId === userId) ?? null;
}

export function getTopN(n: number): LeaderboardEntry[] {
  return _entries.slice(0, n);
}
