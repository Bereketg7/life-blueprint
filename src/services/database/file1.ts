import { runQuery } from './db';

export async function runMigrations(): Promise<void> {
  await runQuery(`
    CREATE TABLE IF NOT EXISTS schema_versions (
      version INTEGER PRIMARY KEY,
      appliedAt TEXT NOT NULL
    );
  `);

  const migrations: { version: number; up: () => Promise<void> }[] = [
    {
      version: 1,
      up: async () => {
        // Initial schema is created via initDatabase; this migration is a no-op placeholder.
      },
    },
  ];

  for (const migration of migrations) {
    const result = await runQuery(
      'SELECT version FROM schema_versions WHERE version = ?',
      [migration.version]
    );
    if (result.rows._array.length === 0) {
      await migration.up();
      await runQuery(
        'INSERT INTO schema_versions (version, appliedAt) VALUES (?, ?)',
        [migration.version, new Date().toISOString()]
      );
    }
  }
}

export function getMigrations(): { version: number }[] {
  return [{ version: 1 }];
}