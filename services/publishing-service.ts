import type { Document } from "@/lib/models/document";

import {
  createJournalPublication,
} from "@/lib/publishing/publication/journal-publication";

import {
  writePublication,
} from "@/lib/publishing/publication/publication-writer";

import {
  LocalPublicationTransport,
} from "@/lib/publishing/transport/local-publication-transport";

import type { PublishedDocument } from "@/lib/publishing/contracts/published-document";

const WEBSITE_PROJECT_PATH =
  process.env.WEBSITE_PROJECT_PATH;

export function createPublication(
  document: Document
): PublishedDocument {
  switch (document.contentTypeId) {
    case "journal":
      return createJournalPublication(document);

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
    createPublication(document);

  const artifactPath =
    writePublication(publication);

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