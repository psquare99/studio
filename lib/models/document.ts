export interface DocumentMetadata {
  [key: string]: string;
}

export interface DocumentBlock {
  id: string;
  type: string;
  data: unknown;
}

export interface Document {
  id: string;

  workspaceId: string;

  contentTypeId: string;

  metadata: DocumentMetadata;

  blocks: DocumentBlock[];

  updatedAt: string;
}