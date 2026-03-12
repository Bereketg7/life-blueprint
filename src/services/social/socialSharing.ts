// Social sharing – share progress to social media

export interface SharePayload {
  title: string;
  message: string;
  url?: string;
  imageUrl?: string;
}

export function buildAchievementShare(
  userName: string,
  achievementName: string,
  appUrl: string = 'https://lifeblueprint.app'
): SharePayload {
  return {
    title: `${userName} unlocked an achievement!`,
    message: `I just unlocked "${achievementName}" on Life Blueprint! 🏆 Join me on my wellness journey: ${appUrl}`,
    url: appUrl,
  };
}

export function buildStreakShare(userName: string, streakDays: number): SharePayload {
  return {
    title: `${userName} is on a ${streakDays}-day streak!`,
    message: `I'm on a ${streakDays}-day wellness streak on Life Blueprint! 🔥 Can you beat it?`,
  };
}

export function buildWeightLossShare(
  userName: string,
  kgLost: number
): SharePayload {
  return {
    title: `${userName} reached a weight loss milestone!`,
    message: `I've lost ${kgLost}kg on Life Blueprint! 💪 Your wellness journey starts here.`,
  };
}

export async function shareToNative(payload: SharePayload): Promise<void> {
  // In production, use react-native Share API
  console.log('[SocialSharing] Sharing:', payload.title);
}

export function generateShareLink(
  userId: string,
  type: 'profile' | 'challenge' | 'achievement',
  id?: string
): string {
  const base = 'https://lifeblueprint.app/share';
  if (type === 'profile') return `${base}/profile/${userId}`;
  if (type === 'challenge') return `${base}/challenge/${id ?? ''}`;
  return `${base}/achievement/${id ?? ''}`;
}
