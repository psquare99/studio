# Media Setup

Studio stores uploaded media separately from document content.

Image binaries are stored in Cloudflare R2, while media metadata is stored in Supabase. Documents then reference uploaded assets through their persistent public URLs.

## 1. Create the R2 bucket

Create a production R2 bucket, for example:

```text
studio-media
Bind it to the Worker/OpenNext deployment as:
MEDIA_BUCKET
The binding must expose an R2Bucket under that exact name.
2. Configure the public media URL
Connect a production custom domain to the R2 bucket and configure:
MEDIA_PUBLIC_URL=https://images.example.com
Do not use the r2.dev development endpoint as the production media URL.
The public URL returned for an uploaded asset is the URL stored by documents that reference that asset.
3. Supabase service key
Add the Supabase service-role key as a server-only secret:
SUPABASE_SERVICE_ROLE_KEY=...
Never expose this key through a NEXT_PUBLIC_* variable or client component.
4. Run the migration
Run:
supabase/migrations/202608190001_create_media_assets.sql
in the Studio Supabase project.
The media assets table is protected by RLS. Studio's server-side media service uses the service-role key to insert media metadata.
5. Deployment binding
The Cloudflare/OpenNext configuration must provide the R2 bucket through the existing MEDIA_BUCKET binding.
For example:
[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "studio-media"
Keep the existing OpenNext configuration intact and add only the required media binding.
6. Upload API
Studio exposes the following upload endpoint:
POST /api/media/upload
The request uses multipart form data.
Fields:
- file — image file
- alt — optional alt text
Supported formats:
- JPEG
- PNG
- WebP
- GIF
- AVIF
Maximum file size: 10 MB.
A successful upload returns a MediaAsset containing the persistent public URL.
7. Using Media in Documents
The editor can upload an image through an image metadata field or reference an existing image URL.
The resulting public URL is stored in the document's metadata or content block.
The document therefore does not contain the image binary itself. It contains a reference to the externally stored asset.
Image File
    │
    ▼
R2 Storage
    │
    ├── Media Metadata → Supabase
    │
    └── Public URL
             │
             ▼
          Document
             │
             ▼
        Publication
             │
             ▼
       Website Content
8. Publishing and Media
Media storage and document publishing remain separate concerns.
Publishing does not move the image binary into the website repository. Instead, the publication artifact retains the persistent media URL referenced by the document.
This allows published documents to use media stored independently from the website's content repository.
Design Principle
Media assets should have their own storage lifecycle.
Studio documents reference those assets rather than owning their binary data. This keeps document persistence, media storage, and website publication independently manageable while allowing them to work together as part of the publishing workflow.
```
