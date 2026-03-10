import { ALL_SCHEMAS } from './schema';

let db: any = null;

export async function initDatabase(): Promise<void> {
  const { openDatabase } = await import('@expo/sqlite');
  db = openDatabase('life_blueprint.db');

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: any) => {
        ALL_SCHEMAS.forEach((schema) => {
          tx.executeSql(schema);
        });
      },
      (error: Error) => reject(error),
      () => resolve()
    );
  });
}

export function getDatabase(): any {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function runQuery(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    getDatabase().transaction((tx: any) => {
      tx.executeSql(
        sql,
        params,
        (_: any, result: any) => resolve(result),
        (_: any, error: Error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}