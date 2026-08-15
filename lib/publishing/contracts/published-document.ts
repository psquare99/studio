export interface PublishedDocument {
  contractVersion: "0.1";

  id: string;

  contentType: string;

  slug: string;

  publishedAt: string;

  metadata: Record<string, unknown>;

  blocks: PublishedBlock[];
}

export interface PublishedBlock {
  id: string;

  type: string;

  data: unknown;
}