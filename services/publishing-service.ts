import type { Document } from "@/lib/models/document";

import {
  createJournalPublication,
} from "@/lib/publishing/publication/journal-publication";

import {
  createProjectPublication,
} from "@/lib/publishing/publication/project-publication";

import {
  GitHubPublicationTransport,
} from "@/lib/publishing/transport/github-publication-transport";

import type { PublishedDocument } from "@/lib/publishing/contracts/published-document";

import {
  deletePublication,
  writePublication,
} from "@/lib/publishing/publication/publication-writer";


export function createPublication(
  document: Document
): PublishedDocument {
  switch (
    document.contentTypeId
  ) {
    case "journal":
      return createJournalPublication(
        document
      );

    case "project":
      return createProjectPublication(
        document
      );

    default:
      throw new Error(
        `Publishing is not supported for content type "${document.contentTypeId}".`
      );
  }
}

export function serializePublication(
  publication: PublishedDocument
): string {
  return JSON.stringify(
    publication,
    null,
    2
  );
}

export async function publishDocument(
  document: Document
): Promise<string> {
  

  const publication =
    createPublication(
      document
    );

  const artifactPath =
    writePublication(
      publication
    );

  const transport =
  new GitHubPublicationTransport();

  return await transport.deliver(
  artifactPath,
  publication.contentType,
  publication.slug
);
}

export async function deletePublishedDocument(
  document: Document
): Promise<void> {
  

  const publication =
    createPublication(
      document
    );

  deletePublication(
    publication
  );

  const transport =
  new GitHubPublicationTransport();

  await transport.remove(
  publication.contentType,
  publication.slug
);
}