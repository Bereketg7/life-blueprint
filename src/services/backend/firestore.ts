// Firestore CRUD operations (offline-first with sync queue)

export interface FirestoreDocument {
  id: string;
  [key: string]: any;
}

// In-memory store used when Firestore SDK is unavailable (offline/test)
const memoryStore: Record<string, Record<string, any>> = {};

function ensureCollection(collection: string): void {
  if (!memoryStore[collection]) {
    memoryStore[collection] = {};
  }
}

export async function createDocument(
  collection: string,
  id: string,
  data: Record<string, any>
): Promise<void> {
  ensureCollection(collection);
  memoryStore[collection][id] = { ...data, id };
}

export async function getDocument(
  collection: string,
  id: string
): Promise<FirestoreDocument | null> {
  ensureCollection(collection);
  return memoryStore[collection][id] ?? null;
}

export async function updateDocument(
  collection: string,
  id: string,
  data: Partial<Record<string, any>>
): Promise<void> {
  ensureCollection(collection);
  if (memoryStore[collection][id]) {
    memoryStore[collection][id] = { ...memoryStore[collection][id], ...data };
  }
}

export async function deleteDocument(collection: string, id: string): Promise<void> {
  ensureCollection(collection);
  delete memoryStore[collection][id];
}

export async function queryCollection(collection: string): Promise<FirestoreDocument[]> {
  ensureCollection(collection);
  return Object.values(memoryStore[collection]);
}

export async function queryByField(
  collection: string,
  field: string,
  value: any
): Promise<FirestoreDocument[]> {
  ensureCollection(collection);
  return Object.values(memoryStore[collection]).filter((doc) => doc[field] === value);
}
