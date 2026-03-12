// Real-time activity feed
import { CommunityPost } from '../../types';

const _feed: CommunityPost[] = [];
const _listeners: Array<(posts: CommunityPost[]) => void> = [];

function generateId(): string {
  return `post_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function notifyListeners(): void {
  const sorted = [..._feed].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  _listeners.forEach((cb) => cb(sorted));
}

export function createPost(
  userId: string,
  userName: string,
  content: string,
  category: string
): CommunityPost {
  const post: CommunityPost = {
    id: generateId(),
    userId,
    userName,
    content,
    likes: 0,
    comments: 0,
    category,
    createdAt: new Date().toISOString(),
  };

  _feed.unshift(post);
  notifyListeners();
  return post;
}

export function likePost(postId: string): void {
  const post = _feed.find((p) => p.id === postId);
  if (post) {
    post.likes += 1;
    notifyListeners();
  }
}

export function subscribeToFeed(
  callback: (posts: CommunityPost[]) => void
): () => void {
  _listeners.push(callback);
  callback([..._feed]);
  return () => {
    const idx = _listeners.indexOf(callback);
    if (idx !== -1) _listeners.splice(idx, 1);
  };
}

export function getFeed(limit: number = 20): CommunityPost[] {
  return [..._feed]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getUserPosts(userId: string): CommunityPost[] {
  return _feed.filter((p) => p.userId === userId);
}
