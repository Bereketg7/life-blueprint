import { storage } from './firebase';

// ─── Cloud Storage ─────────────────────────────────────────────────────────────

/**
 * Upload a photo from a local URI and return the remote download URL.
 * In production the URI is read via FileSystem/fetch and uploaded as a Blob.
 */
export async function uploadPhoto(uri: string, path: string): Promise<string> {
  // Convert URI to a base64 string representation for the mock store.
  // In production use expo-file-system readAsStringAsync + uploadAsync, or
  // fetch the URI and send the Blob to Firebase Storage.
  const base64Stub = `base64:${uri.split('/').pop() ?? 'photo'}`;

  const ref = storage.ref(path);
  const snapshot = await ref.put(base64Stub);
  const downloadUrl = await snapshot.ref.getDownloadURL();
  return downloadUrl;
}

/**
 * Delete a photo at the given storage path.
 */
export async function deletePhoto(path: string): Promise<void> {
  await storage.ref(path).delete();
}
