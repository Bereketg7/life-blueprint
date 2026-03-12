// Friend management service
import { Friend } from '../../types';

const _friends: Map<string, Friend[]> = new Map();

function generateId(): string {
  return `friend_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function addFriend(userId: string, friendData: Omit<Friend, 'userId' | 'addedAt'>): Friend {
  const friend: Friend = {
    ...friendData,
    userId,
    addedAt: new Date().toISOString(),
  };

  const list = _friends.get(userId) ?? [];
  list.push(friend);
  _friends.set(userId, list);
  return friend;
}

export function removeFriend(userId: string, friendId: string): void {
  const list = _friends.get(userId) ?? [];
  _friends.set(
    userId,
    list.filter((f) => f.friendId !== friendId)
  );
}

export function getFriends(userId: string): Friend[] {
  return _friends.get(userId) ?? [];
}

export function searchFriends(userId: string, query: string): Friend[] {
  const list = getFriends(userId);
  const q = query.toLowerCase();
  return list.filter((f) => f.username.toLowerCase().includes(q));
}

export function getActiveFriends(userId: string): Friend[] {
  return getFriends(userId).filter((f) => f.status === 'active');
}

export function sortFriendsByLevel(friends: Friend[]): Friend[] {
  return [...friends].sort((a, b) => b.level - a.level);
}

export function sortFriendsByStreak(friends: Friend[]): Friend[] {
  return [...friends].sort((a, b) => b.streak - a.streak);
}
