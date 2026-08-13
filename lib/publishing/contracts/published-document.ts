export interface PublishedDocument {
  contractVersion: "0.1";

  id: string;

  contentType: string;

  slug: string;

  publishedAt: string;

  metadata: {
    title: string;
    excerpt?: string;
    category?: string;
    location?: string;
    featured?: boolean;
  };

  blocks: PublishedBlock[];
}

export interface PublishedBlock {
  id: string;

  type: string;

  data: unknown;
}