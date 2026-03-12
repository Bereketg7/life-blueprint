import { LevelUnlock } from '../../types';

const ALL_UNLOCKS: LevelUnlock[] = [
  { level: 5,  feature: 'Custom Themes',          description: 'Personalize the app with exclusive color themes',        icon: '🎨', isUnlocked: false },
  { level: 10, feature: 'Custom Badges',           description: 'Design and display your personal achievement badges',    icon: '🏅', isUnlocked: false },
  { level: 15, feature: 'Advanced Analytics',      description: 'Deep health insights and predictive trend graphs',       icon: '📊', isUnlocked: false },
  { level: 20, feature: 'Social Features',         description: 'Connect with friends, share progress, join challenges', icon: '👥', isUnlocked: false },
  { level: 25, feature: 'AI Coach Pro',            description: 'Unlock the full AI coach with personalised plans',       icon: '🤖', isUnlocked: false },
  { level: 30, feature: 'Battle Pass',             description: 'Access seasonal battle pass with exclusive rewards',    icon: '⚔️',  isUnlocked: false },
  { level: 35, feature: 'Nutrition Planner',       description: 'AI-powered meal planning tailored to your goals',       icon: '🥗', isUnlocked: false },
  { level: 40, feature: 'Workout Builder',         description: 'Create custom workout programs with smart suggestions', icon: '💪', isUnlocked: false },
  { level: 45, feature: 'Sleep Coach',             description: 'Advanced sleep analysis and personalised improvements', icon: '😴', isUnlocked: false },
  { level: 50, feature: 'Elite Dashboard',         description: 'Platinum-tier dashboard with all metrics in one view',  icon: '🏆', isUnlocked: false },
  { level: 60, feature: 'Biometric Integration',   description: 'Deep wearable sync and biometric trend tracking',       icon: '⌚', isUnlocked: false },
  { level: 75, feature: 'Diamond Status',          description: 'Elite profile frame, title, and exclusive challenges',  icon: '💎', isUnlocked: false },
  { level: 100, feature: 'Legendary Status',       description: 'The highest tier — prestige, rainbow badge, and more', icon: '🌈', isUnlocked: false },
];

export function getUnlocksAtLevel(level: number): LevelUnlock[] {
  return ALL_UNLOCKS.filter(u => u.level === level);
}

export function getUnlockedFeatures(userLevel: number): LevelUnlock[] {
  return ALL_UNLOCKS.map(u => ({
    ...u,
    isUnlocked: userLevel >= u.level,
  }));
}

export function getNextUnlocks(userLevel: number, count: number = 3): LevelUnlock[] {
  return ALL_UNLOCKS
    .filter(u => u.level > userLevel)
    .slice(0, count)
    .map(u => ({ ...u, isUnlocked: false }));
}

export function getAllUnlocks(): LevelUnlock[] {
  return [...ALL_UNLOCKS];
}
