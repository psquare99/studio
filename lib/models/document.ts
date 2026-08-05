export interface Document {
  id: string;

  workspaceId: string;

  contentTypeId: string;

  metadata: Record<string, string>;

  blocks: DocumentBlock[];

  updatedAt: string;
}

export interface DocumentBlock {
  id: string;

  type: string;

  data: unknown;
}