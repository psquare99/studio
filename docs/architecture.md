# Studio Architecture

Studio is the authoring and publishing system for the website.

Its architecture is organized around a small number of independent concepts:

```text
Studio
│
├── Document
│   ├── System Metadata
│   ├── Schema Metadata
│   └── Content Blocks
│
├── Schema
│   ├── Content Type Definition
│   ├── Metadata Fields
│   └── Allowed Block Types
│
├── Editor
│   ├── Metadata Editor
│   └── Block Editor
│
└── Publishing
    ├── Publication Contract
    ├── Publication Writer
    ├── GitHub Transport
    └── Published Slug Lifecycle
Document
A Document is the central unit of content in Studio.
A document contains:
- System Metadata — identity, workspace, content type, status, timestamps, and publishing state.
- Schema Metadata — fields defined by the document's content type.
- Content Blocks — structured content edited through the block editor.
Documents move through a lifecycle such as:
Draft
  │
  ▼
Published
  │
  ▼
Modified
  │
  ▼
Published
A published document retains its publication identity through publishedSlug.
Schema
A Schema defines how a particular content type behaves in Studio.
A schema describes:
- The content type name.
- Metadata fields.
- Field types and options.
- Required fields.
- Allowed content blocks.
The editor uses the schema to determine which metadata fields and blocks can be presented for a document.
This keeps content structure separate from the editor implementation.
Editor
The Editor provides the authoring interface for documents.
It consists of two primary areas:
Metadata Editor
The metadata editor renders fields from the active schema.
It supports field types such as:
- Text
- Select
- Image
- List
- Date
- Boolean
Block Editor
The block editor manages the structured content blocks allowed by the active schema.
The editor operates on the document's current in-memory state while Studio persists changes through the document API.
Autosave
Document changes are automatically persisted after a short delay.
When a published document is edited, saving changes its status from:
published → modified
This distinguishes an edited publication from the version currently represented on the website.
Publishing
Publishing converts the Studio document into the website's publication format.
The publishing pipeline is separated into several responsibilities:
Document
   │
   ▼
Publication Contract
   │
   ▼
Publication Writer
   │
   ▼
GitHub Publication Transport
   │
   ▼
Website Repository
Publication Contract
The publication contract defines the stable structure that the website consumes.
It contains:
- Document identity.
- Content type.
- Published slug.
- Publication timestamp.
- Publication metadata.
- Content blocks.
Journal and Project documents each have their own publication mapping while producing the common published-document contract.
Publication Writer
The publication writer converts an authored Studio document into a publication artifact.
The writer is responsible for content transformation and publication-path decisions, while transport is handled separately.
GitHub Transport
The GitHub publication transport writes publication artifacts to the website's content repository.
This keeps the website's published content independent from Studio's internal database representation.
Published Slug Lifecycle
Published documents have a persistent publishedSlug.
The slug represents the document's public identity on the website.
The lifecycle is:
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
When a published document's slug changes, the publishing system handles the transition between the previous and new publication paths.
The persisted publishedSlug allows Studio to know which previously published resource belongs to the document.
Persistence
Studio persists documents through its document API and database.
The persisted document is authoritative for publication.
The publishing operation therefore follows this general sequence:
Editor State
    │
    ▼
Save Document
    │
    ▼
Persisted Document
    │
    ▼
Publish
    │
    ▼
Publication Artifact
    │
    ▼
Website Repository
This separation prevents the website publication format from becoming coupled to the editor's internal state.
Media
Media uploaded through Studio is handled separately from document content.
An uploaded asset receives a persistent URL, which can then be stored in document metadata or content blocks.
The publishing system passes those references through to the resulting publication artifact.
Architectural Principles
Studio follows a few important boundaries:
1. Documents own content.
2. Schemas define content structure.
3. Editors provide authoring interfaces.
4. Publication contracts define the website-facing format.
5. Publication writers transform documents into that format.
6. Transport is responsible for delivering publication artifacts.
7. The database remains the authoritative source for Studio documents.
8. Published slugs provide stable publication identity across updates.
The goal is to keep authoring, content modeling, publishing, and transport separate so that each layer can evolve without turning Studio into a monolithic system.
```
