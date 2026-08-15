export type DocumentStatus =
  | "draft"
  | "published"
  | "modified";

export type MetadataValue =
  | string
  | number
  | boolean
  | string[]
  | null;

export interface DocumentMetadata {
  [key: string]: MetadataValue;
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

  status: DocumentStatus;

  publishedAt?: string;

  updatedAt: string;
}