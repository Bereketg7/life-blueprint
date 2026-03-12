// Unlockables – features and rewards unlocked at specific levels

export interface Unlockable {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  type: 'feature' | 'cosmetic' | 'badge' | 'title';
}

export const ALL_UNLOCKABLES: Unlockable[] = [
  {
    id: 'battle_pass',
    name: 'Battle Pass',
    description: 'Unlock seasonal challenges and exclusive rewards',
    requiredLevel: 5,
    type: 'feature',
  },
  {
    id: 'social_challenges',
    name: 'Social Challenges',
    description: 'Challenge friends to fitness competitions',
    requiredLevel: 10,
    type: 'feature',
  },
  {
    id: 'ai_coach',
    name: 'AI Voice Coach',
    description: 'Get personalised coaching with voice interaction',
    requiredLevel: 15,
    type: 'feature',
  },
  {
    id: 'biomarker_tracking',
    name: 'Biomarker Tracking',
    description: 'Track advanced health metrics like HRV and VO2 max',
    requiredLevel: 20,
    type: 'feature',
  },
  {
    id: 'health_reports',
    name: 'Health Reports',
    description: 'Generate detailed PDF health reports',
    requiredLevel: 25,
    type: 'feature',
  },
  {
    id: 'custom_themes',
    name: 'Custom Themes',
    description: 'Unlock 10+ visual themes for the app',
    requiredLevel: 30,
    type: 'cosmetic',
  },
  {
    id: 'title_wellness_warrior',
    name: 'Wellness Warrior Title',
    description: 'Display your title on the leaderboard',
    requiredLevel: 25,
    type: 'title',
  },
  {
    id: 'fhir_integration',
    name: 'Doctor Integration',
    description: 'Share health data with your healthcare provider',
    requiredLevel: 50,
    type: 'feature',
  },
  {
    id: 'global_leaderboard',
    name: 'Global Leaderboard',
    description: 'Compete with users worldwide',
    requiredLevel: 100,
    type: 'feature',
  },
];

export function getUnlockedFeatures(level: number): Unlockable[] {
  return ALL_UNLOCKABLES.filter((u) => u.requiredLevel <= level);
}

export function getUpcomingUnlockables(level: number, count: number = 3): Unlockable[] {
  return ALL_UNLOCKABLES
    .filter((u) => u.requiredLevel > level)
    .sort((a, b) => a.requiredLevel - b.requiredLevel)
    .slice(0, count);
}

export function isFeatureUnlocked(featureId: string, level: number): boolean {
  const unlockable = ALL_UNLOCKABLES.find((u) => u.id === featureId);
  return unlockable ? level >= unlockable.requiredLevel : false;
}
