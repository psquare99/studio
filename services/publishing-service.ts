import type { Document } from "@/lib/models/document";

import {
  createJournalPublication,
} from "@/lib/publishing/publication/journal-publication";

import {
  createProjectPublication,
} from "@/lib/publishing/publication/project-publication";

import {
  LocalPublicationTransport,
} from "@/lib/publishing/transport/local-publication-transport";

import type { PublishedDocument } from "@/lib/publishing/contracts/published-document";

import {
  deletePublication,
  writePublication,
} from "@/lib/publishing/publication/publication-writer";

const WEBSITE_PROJECT_PATH =
  process.env.WEBSITE_PROJECT_PATH;

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

export function publishDocument(
  document: Document
): string {
  if (!WEBSITE_PROJECT_PATH) {
    throw new Error(
      "WEBSITE_PROJECT_PATH is not configured."
    );
  }

  const publication =
    createPublication(
      document
    );

  const artifactPath =
    writePublication(
      publication
    );

  const transport =
    new LocalPublicationTransport(
      WEBSITE_PROJECT_PATH
    );

  return transport.deliver(
    artifactPath,
    publication.contentType,
    publication.slug
  );
}

export function deletePublishedDocument(
  document: Document
): void {
  if (!WEBSITE_PROJECT_PATH) {
    throw new Error(
      "WEBSITE_PROJECT_PATH is not configured."
    );
  }

  const publication =
    createPublication(
      document
    );

  deletePublication(
    publication
  );

  const transport =
    new LocalPublicationTransport(
      WEBSITE_PROJECT_PATH
    );

  transport.remove(
    publication.contentType,
    publication.slug
  );
}