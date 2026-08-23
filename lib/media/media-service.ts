import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { MediaAsset } from "@/lib/models/media-asset";
import { getSupabaseServer } from "@/lib/supabase-server";
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

function getEnv() {
  const { env } = getCloudflareContext();
  return env as CloudflareEnv & {
    MEDIA_BUCKET: R2Bucket;
    MEDIA_PUBLIC_URL: string;
  };
}

function getExtension(mimeType: string) {
  const extension = EXTENSIONS[mimeType];

  if (!extension) {
    throw new Error("Unsupported image type.");
  }

  return extension;
}

function sanitizeFilename(filename: string) {
  const base = filename
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);

  return base || "image";
}

export async function uploadImage(
  file: File,
  alt = "",
): Promise<MediaAsset> {
  const env = getEnv();

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded.");
  }

  if (!EXTENSIONS[file.type]) {
    throw new Error(
      "Unsupported image type. Use JPEG, PNG, WebP, GIF, or AVIF.",
    );
  }

  if (file.size <= 0) {
    throw new Error("The image file is empty.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Images must be 10 MB or smaller.");
  }

  const id = crypto.randomUUID();
  const extension = getExtension(file.type);
  const filename = sanitizeFilename(file.name);
  const key = `media/${new Date().getUTCFullYear()}/${id}.${extension}`;
  const publicUrl = `${env.MEDIA_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  const createdAt = new Date().toISOString();

  const body = await file.arrayBuffer();

  await env.MEDIA_BUCKET.put(key, body, {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
    customMetadata: {
      originalFilename: filename,
      mediaAssetId: id,
    },
  });

  const asset: MediaAsset = {
    id,
    key,
    url: publicUrl,
    filename,
    mimeType: file.type,
    size: file.size,
    alt,
    createdAt,
  };

  const supabaseServer = getSupabaseServer();

const { error } = await supabaseServer
  .from("media_assets")
    .insert({
      id: asset.id,
      storage_key: asset.key,
      public_url: asset.url,
      filename: asset.filename,
      mime_type: asset.mimeType,
      size: asset.size,
      alt: asset.alt,
      created_at: asset.createdAt,
    });

  if (error) {
    await env.MEDIA_BUCKET.delete(key);
    throw new Error(`Failed to save media metadata: ${error.message}`);
  }

  return asset;
}
