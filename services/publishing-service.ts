import type { Document } from "@/lib/models/document";

import { createJournalPublication } from "@/lib/publishing/publication/journal-publication";
import type { PublishedDocument } from "@/lib/publishing/contracts/published-document";

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