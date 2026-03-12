// Custom analytics event definitions

export const AnalyticsEvents = {
  // Auth
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',

  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_SKIPPED: 'onboarding_skipped',

  // Activity
  ACTIVITY_LOGGED: 'activity_logged',
  ACTIVITY_DELETED: 'activity_deleted',

  // Nutrition
  MEAL_LOGGED: 'meal_logged',
  MEAL_PHOTO_CAPTURED: 'meal_photo_captured',
  BARCODE_SCANNED: 'barcode_scanned',

  // Sleep
  SLEEP_LOGGED: 'sleep_logged',

  // Mood
  MOOD_LOGGED: 'mood_logged',

  // Wearables
  WEARABLE_CONNECTED: 'wearable_connected',
  WEARABLE_SYNCED: 'wearable_synced',
  WEARABLE_DISCONNECTED: 'wearable_disconnected',

  // Gamification
  QUEST_COMPLETED: 'quest_completed',
  LEVEL_UP: 'level_up',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  BATTLE_PASS_REWARD_CLAIMED: 'battle_pass_reward_claimed',

  // Social
  FRIEND_ADDED: 'friend_added',
  CHALLENGE_JOINED: 'challenge_joined',
  CHALLENGE_COMPLETED: 'challenge_completed',

  // AI Coach
  COACH_MESSAGE_SENT: 'coach_message_sent',
  VOICE_COMMAND_USED: 'voice_command_used',

  // Reports
  REPORT_GENERATED: 'report_generated',
  REPORT_EXPORTED: 'report_exported',

  // Settings
  THEME_CHANGED: 'theme_changed',
  ACCESSIBILITY_CHANGED: 'accessibility_changed',
} as const;

export type AnalyticsEventName = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];
