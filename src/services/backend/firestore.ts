import { db } from './firebase';

export interface QueryFilter {
  field: string;
  operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'array-contains';
  value: unknown;
}

// ─── Firestore CRUD ────────────────────────────────────────────────────────────

export async function createDocument(
  collection: string,
  data: Record<string, unknown>
): Promise<string> {
  const ref = await db.collection(collection).add({
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getDocument<T>(collection: string, id: string): Promise<T> {
  const snap = await db.collection(collection).doc(id).get();
  if (!snap.exists) {
    throw new Error(`Document ${id} not found in ${collection}`);
  }
  return snap.data() as T;
}

export async function updateDocument(
  collection: string,
  id: string,
  data: Partial<Record<string, unknown>>
): Promise<void> {
  await db.collection(collection).doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteDocument(collection: string, id: string): Promise<void> {
  await db.collection(collection).doc(id).delete();
}

export async function queryDocuments<T>(
  collection: string,
  filters: QueryFilter[]
): Promise<T[]> {
  if (filters.length === 0) {
    const snap = await db.collection(collection).get();
    return snap.docs.map((d) => d.data() as T);
  }

  // Apply first filter via the .where() API; subsequent filters applied in-memory
  const [first, ...rest] = filters;
  let snap = await db
    .collection(collection)
    .where(first.field, first.operator, first.value)
    .get();

  let results = snap.docs.map((d) => d.data() as T);

  for (const filter of rest) {
    results = results.filter((doc) => {
      const val = (doc as Record<string, unknown>)[filter.field];
      switch (filter.operator) {
        case '==': return val === filter.value;
        case '!=': return val !== filter.value;
        case '>':  return (val as number) > (filter.value as number);
        case '>=': return (val as number) >= (filter.value as number);
        case '<':  return (val as number) < (filter.value as number);
        case '<=': return (val as number) <= (filter.value as number);
        case 'array-contains': return Array.isArray(val) && val.includes(filter.value);
        default: return true;
      }
    });
  }

  return results;
}

export function subscribeToCollection<T>(
  collection: string,
  callback: (docs: T[]) => void
): () => void {
  return db.collection(collection).onSnapshot((snapshot) => {
    const docs = snapshot.docs.map((d) => d.data() as T);
    callback(docs);
  });
}
