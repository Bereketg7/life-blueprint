// Cloud Storage service for photo uploads

export interface UploadResult {
  url: string;
  path: string;
  size: number;
}

const _uploads: Record<string, UploadResult> = {};

export async function uploadPhoto(
  localUri: string,
  userId: string,
  category: 'meals' | 'profile' | 'progress'
): Promise<UploadResult> {
  const filename = `${userId}/${category}/${Date.now()}.jpg`;
  const result: UploadResult = {
    url: `https://storage.example.com/${filename}`,
    path: filename,
    size: 0,
  };
  _uploads[filename] = result;
  return result;
}

export async function deletePhoto(path: string): Promise<void> {
  delete _uploads[path];
}

export function getUploadedUrl(path: string): string | null {
  return _uploads[path]?.url ?? null;
}
