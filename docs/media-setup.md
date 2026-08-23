# Media Setup — Phase 1

Studio's first media capability stores image binaries in Cloudflare R2 and media metadata in Supabase.

## 1. Create the R2 bucket

Create a production R2 bucket, for example:

```text
studio-media
```

Bind it to the Worker/OpenNext deployment as `MEDIA_BUCKET`.

The binding must expose an `R2Bucket` under that exact name.

## 2. Configure the public media URL

Connect a production custom domain to the R2 bucket and configure:

```text
MEDIA_PUBLIC_URL=https://images.example.com
```

Do not use the `r2.dev` development endpoint as the production media URL.

## 3. Supabase service key

Add the Supabase service-role key as a server-only secret:

```text
SUPABASE_SERVICE_ROLE_KEY=...
```

Never expose this key through a `NEXT_PUBLIC_*` variable or client component.

## 4. Run the migration

Run:

```text
supabase/migrations/202608190001_create_media_assets.sql
```

in the Studio Supabase project.

The table is intentionally protected by RLS. Studio's server-side media service uses the service-role key to insert metadata.

## 5. Deployment binding example

Add the equivalent of this binding to the existing Cloudflare/OpenNext configuration:

```toml
[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "studio-media"
```

Keep the exact existing OpenNext configuration and add only the R2 binding; do not replace the project's current deployment settings.

## Current upload contract

`POST /api/media/upload`

Multipart fields:

- `file` — image file
- `alt` — optional alt text

Supported formats:

- JPEG
- PNG
- WebP
- GIF
- AVIF

Maximum size: 10 MB.

The response contains a `MediaAsset` with the public URL. The existing image block stores that URL as its `src`.
