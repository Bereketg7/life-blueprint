/**
 * Tests for the environment configuration helper.
 * Verifies that IS_FIREBASE_CONFIGURED, IS_VISION_CONFIGURED, and
 * IS_OPENAI_CONFIGURED are false when the env vars are absent (as in CI / test).
 */

describe('env config', () => {
  it('IS_FIREBASE_CONFIGURED is false when env vars are absent', () => {
    // We re-require the module so the test is env-isolated
    jest.resetModules();
    const { IS_FIREBASE_CONFIGURED } = jest.requireActual('../config/env');
    expect(IS_FIREBASE_CONFIGURED).toBe(false);
  });

  it('IS_VISION_CONFIGURED is false when env vars are absent', () => {
    jest.resetModules();
    const { IS_VISION_CONFIGURED } = jest.requireActual('../config/env');
    expect(IS_VISION_CONFIGURED).toBe(false);
  });

  it('IS_OPENAI_CONFIGURED is false when env vars are absent', () => {
    jest.resetModules();
    const { IS_OPENAI_CONFIGURED } = jest.requireActual('../config/env');
    expect(IS_OPENAI_CONFIGURED).toBe(false);
  });
});
