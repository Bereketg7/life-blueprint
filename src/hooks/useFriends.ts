import { useState, useCallback } from 'react';
import { Friend } from '../types';
import { addFriend, removeFriend, getFriends, sortFriendsByLevel } from '../services/social/friendService';

export function useFriends(userId: string) {
  const [friends, setFriends] = useState<Friend[]>(() => getFriends(userId));

  const add = useCallback(
    (friendData: Omit<Friend, 'userId' | 'addedAt'>) => {
      const friend = addFriend(userId, friendData);
      setFriends(getFriends(userId));
      return friend;
    },
    [userId]
  );

  const remove = useCallback(
    (friendId: string) => {
      removeFriend(userId, friendId);
      setFriends(getFriends(userId));
    },
    [userId]
  );

  const refresh = useCallback(() => {
    setFriends(getFriends(userId));
  }, [userId]);

  const sortedByLevel = sortFriendsByLevel(friends);

  return {
    friends,
    sortedByLevel,
    addFriend: add,
    removeFriend: remove,
    refresh,
    friendCount: friends.length,
  };
}
