## Summary

Hardens the Studio publication lifecycle by introducing an authoritative `publishedSlug` field that tracks the last successfully published slug. This prevents orphaning of published content when documents are deleted, slugs are changed, or publication fails mid-flow.

## Changes

### Core Architecture
- **New `publishedSlug` field** on `Document` model - tracks the last successfully published slug
- **Separate from `metadata.slug`** - the editable slug that autosave modifies
- **Migration** adds nullable `published_slug` column with backfill for 6 verified production documents

### Key Fixes

1. **Published document deletion** now removes GitHub publication **before** deleting the database row (fixes P0-3 orphaning)
2. **Slug changes** use PUT new → DELETE old pattern:
   - PUT new file first
   - DELETE old file using `publishedSlug`
   - Only then persist new `publishedSlug`
3. **Unpublish** uses `publishedSlug` (not editable `metadata.slug`)
3. **Failed slug migration** retains old `publishedSlug` for safe retry

### Failure Behavior

| Scenario | Behavior |
|----------|----------|
| New PUT fails | `publishedSlug` unchanged, old file intact |
| Old DELETE fails | `publishedSlug` unchanged, retry safe |
| DB update fails after GitHub success | `publishedSlug` unchanged, retry converges |
| Retry after new PUT succeeded | Idempotent PUT, safe |
| Retry after old DELETE failed | Retries DELETE of old `publishedSlug` |

### Migration

- Adds nullable `published_slug` column
- Backfills **only 6 explicitly reconciled production documents** (no generic backfill)
- Migration NOT applied - requires manual approval

## Verification

- `tsc --noEmit` ✅ PASS
- `eslint` ✅ 0 errors (2 pre-existing warnings)
- `npm run build` ✅ PASS
- `git diff --check` ✅ PASS
- Exact diffstat: 6 files, 113 insertions(+), 32 deletions(-)

## Scope

**Scope:** Studio only
- No Website changes
- No production DB changes
- No deployment
- Migration NOT applied
- No Website changes
- No Studio auth/media changes
- `docs/PROJECT-PAGE-SYSTEM.md` untouched