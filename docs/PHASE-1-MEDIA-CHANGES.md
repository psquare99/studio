# Studio Phase 1 — Media Capability

Implemented in this package:

- Cloudflare R2-backed image upload service.
- Supabase `media_assets` metadata model/table migration.
- Server-only Supabase service-role client.
- Authenticated `POST /api/media/upload` route.
- Existing image block upgraded with an Upload Image control while retaining URL input.
- 10 MB image limit.
- JPEG, PNG, WebP, GIF and AVIF support.
- Immutable one-year cache headers on uploaded objects.
- ADR-007 documenting the storage decision.
- Media setup guide for R2 binding, public media URL, and Supabase service key.

Not included yet:

- Website-side image rendering changes.
- Media library UI.
- Image transformations/resizing.
- Asset deletion/cleanup UI.

Before running it, apply the Supabase migration and configure the Cloudflare R2 binding plus the server-only `SUPABASE_SERVICE_ROLE_KEY` and `MEDIA_PUBLIC_URL`.
