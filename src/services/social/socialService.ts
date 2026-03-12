import { Friend, SocialChallenge, ActivityFeedItem } from '../../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// --- Friend Management ---
export function sendFriendRequest(userId: string, friendId: string, friendName: string): Friend {
  return {
    id: generateId(),
    userId,
    friendId,
    friendName,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export function acceptFriendRequest(friend: Friend): Friend {
  return { ...friend, status: 'accepted' };
}

export function blockFriend(friend: Friend): Friend {
  return { ...friend, status: 'blocked' };
}

export function removeFriend(friends: Friend[], friendId: string): Friend[] {
  return friends.filter(f => f.friendId !== friendId);
}

export function getFriends(friends: Friend[]): Friend[] {
  return friends.filter(f => f.status === 'accepted');
}

// --- Challenges ---
export function createSocialChallenge(
  type: SocialChallenge['type'],
  title: string,
  durationDays: number = 30,
  participants: { userId: string; name: string }[] = [],
): SocialChallenge {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + durationDays);

  const participantsWithScore = participants.map(p => ({ ...p, score: 0 }));

  return {
    id: generateId(),
    type,
    title,
    duration: durationDays,
    participants: participantsWithScore,
    leaderboard: participantsWithScore.map((p, i) => ({ rank: i + 1, ...p })),
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    status: 'active',
  };
}

export function updateChallengeScore(
  challenge: SocialChallenge,
  userId: string,
  score: number,
): SocialChallenge {
  const updatedParticipants = challenge.participants.map(p =>
    p.userId === userId ? { ...p, score: p.score + score } : p,
  );

  // Recalculate leaderboard
  const sorted = [...updatedParticipants].sort((a, b) => b.score - a.score);
  const leaderboard = sorted.map((p, i) => ({ rank: i + 1, ...p }));

  return { ...challenge, participants: updatedParticipants, leaderboard };
}

export function completeChallenge(challenge: SocialChallenge): SocialChallenge {
  return { ...challenge, status: 'completed' };
}

// --- Activity Feed ---
export function createFeedItem(
  userId: string,
  userName: string,
  type: ActivityFeedItem['type'],
  title: string,
  description: string,
): ActivityFeedItem {
  return {
    id: generateId(),
    userId,
    userName,
    type,
    title,
    description,
    timestamp: new Date().toISOString(),
  };
}

export function getFeed(feedItems: ActivityFeedItem[], friendIds: string[]): ActivityFeedItem[] {
  return feedItems
    .filter(item => friendIds.includes(item.userId))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 50);
}

// --- Social Sharing ---
export async function shareProgress(
  caption: string,
  screenshotUri?: string,
): Promise<boolean> {
  // Real impl would use expo-sharing
  void caption;
  void screenshotUri;
  return true;
}
