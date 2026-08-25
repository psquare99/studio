# Studio Editor

## Philosophy

Writing comes first.

The editor should disappear.

Studio is designed to keep the author focused on content rather than the mechanics of storage, publishing, or website delivery.

## Architecture

The editor works with a document defined by its schema:

```text
Document
   │
   ├── Metadata
   │
   └── Content Blocks
          │
          ▼
      Block Editor

The active schema determines which metadata fields and content blocks are available for the document.
Metadata Editor
The metadata editor renders fields from the document's active schema.
Supported field types include:
- Text
- Select
- Image
- List
- Date
- Boolean
The editor keeps metadata in the document's current editing state and persists changes through the document API.
Image Fields
Image fields support:
- Entering an existing image URL.
- Uploading an image through Studio's media upload endpoint.
- Storing the resulting persistent asset URL in document metadata.
Block Editor
The block editor manages the structured content blocks allowed by the document's schema.
Only block types declared by the active schema can be added to a document.
The block editor updates the document's in-memory block state, which is then persisted through the document save mechanism.
Autosave
Document changes are automatically saved after a short delay.
The editor tracks the current document state against the last successfully persisted state.
When changes are detected, Studio saves the document through the document API.
The editor exposes the current persistence state to the author:
- Saved
- Saving...
- Save failed
If a save fails, the editor exposes the error and provides a retry action.
Document Lifecycle
The editor participates in the document lifecycle:
Draft
  │
  │ Publish
  ▼
Published
  │
  │ Edit
  ▼
Modified
  │
  │ Update
  ▼
Published
Editing a published document changes its persisted status to modified.
This indicates that the Studio version contains changes that are not yet represented by the current website publication.
Publishing
The editor provides the author with the Publish or Update action appropriate to the document's current status.
Before publishing, Studio ensures that pending document changes have been persisted.
The publishing operation is then handled by the publishing pipeline.
The editor is responsible for initiating the operation and reflecting its result in the interface; it does not contain the publication transformation or transport logic.
Responsibilities
The editor is responsible for:
- Presenting document metadata.
- Presenting the block editor.
- Enforcing the active schema at the editing interface.
- Managing the current editing state.
- Autosaving document changes.
- Reporting save failures.
- Providing image upload controls.
- Initiating publish/update actions.
- Reflecting document and publication status to the author.
Non-Responsibilities
The editor should not own:
- Publication contract definitions.
- Publication transformations.
- GitHub transport.
- Website repository structure.
- Published slug persistence logic.
- Database implementation details.
- Website rendering.
- Website revalidation.
Those responsibilities belong to the appropriate Studio persistence and publishing layers.
Design Principle
The editor should remain an authoring interface, not become the publishing system itself.
Its job is simple:
Author
  │
  ▼
Editor
  │
  ▼
Document
  │
  ▼
Save / Publish
The underlying persistence and publishing systems should remain behind this interface so that the author can focus on writing.
```
