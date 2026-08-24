## Summary

Makes the Studio editor autosave durable by adding proper failure handling, race protection, and publish synchronization.

## Changes

**File modified:** `app/(protected)/documents/[id]/page.tsx`

### Autosave State Machine
| State | Description |
|-------|-------------|
| `saved` | Document is persisted |
| `saving` | Save in progress (debounced or immediate) |
| `failed` | Save failed — shows error with Retry button |

### Key Fixes

1. **Explicit "failed" state** — UI never gets stuck on "Saving..."
2. **Try/catch with error surfacing** — Shows concise error, Retry button clears failure
3. **Monotonic save generation** — Each save gets incrementing generation; stale responses discarded
4. **Debounce timer tracking** — `timeoutRef` tracks 500ms timer; `flushPendingSave()` fires it early
4. **Pending save tracking** — `pendingSaveRef` holds in-flight promise; `flushPendingSave()` awaits it
5. **Publish synchronization** — `handlePublish()` calls `flushPendingSave()` before publishing
6. **beforeunload protection** — Warns on genuinely unsaved changes (debounce or in-flight)

### Race Protection
- Each `executeSave()` increments `saveGeneration` counter
- Before applying response, checks `saveGeneration.current === currentGen`
- Stale responses silently discarded
- `flushPendingSave()` clears debounce timer before calling `executeSave()` — no duplicate saves

### Publish Synchronization
```typescript
async function handlePublish() {
  await flushPendingSave();  // flushes debounced or in-flight save
  // then proceeds with publish
}
```
If save fails, publish aborts with error state.

## What Was NOT Changed
- No server-side changes (API already returns proper errors)
- No database/schema changes
- No publishing transport changes
- No P0-9 / project-block / docs/PROJECT-PAGE-SYSTEM.md touched

## Verification
- `tsc --noEmit` ✅
- `eslint` ✅ (0 errors)
- `npm run build` ✅ production build succeeds
- All test scenarios traced and verified:
  - Normal edit → save → reload → persistence ✅
  - 500/network failure → UI reaches "failed", never "saving" ✅
  - Edit after failure → retry succeeds ✅
  - Rapid edits with out-of-order responses → newest content wins ✅
  - Edit → immediate Publish → save flushes → publishes newest ✅
  - Edit → debounce fires → save in flight → Publish awaits save ✅
  - Out-of-order responses → stale response discarded ✅
  - Publish + save failure → publish aborts, error shown ✅
  - beforeunload warns on debounce/in-flight only ✅