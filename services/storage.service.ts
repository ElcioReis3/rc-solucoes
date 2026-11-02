import "server-only";
import { randomUUID } from "node:crypto";
import { getAdminStorageBucket } from "./firebase/admin";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

export class InvalidImageError extends Error {}

/**
 * Validates and uploads one image file to Cloud Storage under `folder`,
 * returning its public URL and storage path (the path is kept so the file
 * can be deleted later from the admin panel).
 */
export async function uploadImage(file: File, folder: string) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new InvalidImageError("Formato de imagem inválido. Use JPG, PNG ou WebP.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new InvalidImageError("Imagem muito grande. O limite é 5MB.");
  }

  const bucket = getAdminStorageBucket();
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${folder}/${randomUUID()}.${extension}`;
  const token = randomUUID();

  const buffer = Buffer.from(await file.arrayBuffer());

  await bucket.file(path).save(buffer, {
    metadata: {
      contentType: file.type,
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    path
  )}?alt=media&token=${token}`;

  return { url, path };
}

/** Deletes a file from Storage. Safe to call even if it's already gone. */
export async function deleteImage(path: string) {
  try {
    await getAdminStorageBucket().file(path).delete();
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code !== 404) throw err;
  }
}
