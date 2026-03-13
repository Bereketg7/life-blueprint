/**
 * Environment configuration for Life Blueprint.
 *
 * In Expo, set these values in your app.config.js under `extra`, or inject
 * them via `babel-plugin-transform-inline-environment-variables`.
 *
 * Example app.config.js:
 *   export default {
 *     extra: {
 *       FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
 *       ...
 *     }
 *   };
 *
 * Copy .env.example to .env and fill in your credentials.
 */

// ── Firebase ──────────────────────────────────────────────────────────────
export const FIREBASE_API_KEY: string = process.env.FIREBASE_API_KEY ?? '';
export const FIREBASE_AUTH_DOMAIN: string = process.env.FIREBASE_AUTH_DOMAIN ?? '';
export const FIREBASE_PROJECT_ID: string = process.env.FIREBASE_PROJECT_ID ?? '';
export const FIREBASE_STORAGE_BUCKET: string = process.env.FIREBASE_STORAGE_BUCKET ?? '';
export const FIREBASE_MESSAGING_SENDER_ID: string = process.env.FIREBASE_MESSAGING_SENDER_ID ?? '';
export const FIREBASE_APP_ID: string = process.env.FIREBASE_APP_ID ?? '';

/** True when all required Firebase env vars are present. */
export const IS_FIREBASE_CONFIGURED: boolean = Boolean(
  FIREBASE_API_KEY &&
    FIREBASE_AUTH_DOMAIN &&
    FIREBASE_PROJECT_ID &&
    FIREBASE_STORAGE_BUCKET &&
    FIREBASE_APP_ID,
);

// ── Google Cloud Vision ───────────────────────────────────────────────────
export const GOOGLE_CLOUD_API_KEY: string = process.env.GOOGLE_CLOUD_API_KEY ?? '';

/** True when the Google Cloud Vision API key is present. */
export const IS_VISION_CONFIGURED: boolean = Boolean(GOOGLE_CLOUD_API_KEY);

// ── OpenAI ────────────────────────────────────────────────────────────────
export const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY ?? '';

/** True when the OpenAI API key is present. */
export const IS_OPENAI_CONFIGURED: boolean = Boolean(OPENAI_API_KEY);
