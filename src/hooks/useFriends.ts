import { useState, useCallback } from 'react';
import { Friend, SocialChallenge, ActivityFeedItem } from '../types';
import { sendFriendRequest, acceptFriendRequest, blockFriend, removeFriend, getFriends, createSocialChallenge, updateChallengeScore, createFeedItem, getFeed } from '../services/social';

export function useFriends(userId: string) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [challenges, setChallenges] = useState<SocialChallenge[]>([]);
  const [feed, setFeed] = useState<ActivityFeedItem[]>([]);

  const addFriend = useCallback((friendId: string, friendName: string) => {
    const req = sendFriendRequest(userId, friendId, friendName);
    setFriends(prev => [...prev, req]);
  }, [userId]);

  const acceptRequest = useCallback((friendId: string) => {
    setFriends(prev => prev.map(f =>
      f.friendId === friendId ? acceptFriendRequest(f) : f
    ));
  }, []);

  const blockUser = useCallback((friendId: string) => {
    setFriends(prev => prev.map(f =>
      f.friendId === friendId ? blockFriend(f) : f
    ));
  }, []);

  const removeFriendById = useCallback((friendId: string) => {
    setFriends(prev => removeFriend(prev, friendId));
  }, []);

  const startChallenge = useCallback((type: SocialChallenge['type'], title: string) => {
    const accepted = getFriends(friends);
    const participants = [{ userId, name: 'You' }, ...accepted.map(f => ({ userId: f.friendId, name: f.friendName }))];
    const c = createSocialChallenge(type, title, 30, participants);
    setChallenges(prev => [...prev, c]);
  }, [userId, friends]);

  const updateScore = useCallback((challengeId: string, score: number) => {
    setChallenges(prev => prev.map(c =>
      c.id === challengeId ? updateChallengeScore(c, userId, score) : c
    ));
  }, [userId]);

  const postFeedItem = useCallback((type: ActivityFeedItem['type'], title: string, description: string) => {
    const item = createFeedItem(userId, 'Me', type, title, description);
    setFeed(prev => [item, ...prev]);
  }, [userId]);

  const friendIds = getFriends(friends).map(f => f.friendId);
  const friendFeed = getFeed(feed, friendIds);

  return { friends: getFriends(friends), challenges, feed: friendFeed, addFriend, acceptRequest, blockUser, removeFriendById, startChallenge, updateScore, postFeedItem };
}
