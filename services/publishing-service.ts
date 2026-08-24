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

// Extract the slug that should be used for publishing from the document.
// Uses metadata.slug if set, otherwise generates from title.
function getPublishSlug(document: Document): string {
  const metadata = document.metadata;
  const explicitSlug = typeof metadata.slug === "string" ? metadata.slug.trim() : "";
  if (explicitSlug) {
    return explicitSlug;
  }
  const title = typeof metadata.title === "string" ? metadata.title.trim() : "";
  if (!title) {
    throw new Error("Cannot generate slug: document has no title.");
  }
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Extract the slug that was last successfully published (stored in publishedSlug).
// Falls back to generating from metadata if publishedSlug is not set.
function getPublishedSlug(document: Document): string {
  if (document.publishedSlug) {
    return document.publishedSlug;
  }
  return getPublishSlug(document);
}

export async function publishDocument(
  document: Document
): Promise<{ publicationPath: string; publishedSlug: string }> {
  const desiredSlug = getPublishSlug(document);
  const currentPublishedSlug = document.publishedSlug;

  // If the slug hasn't changed, just do a normal PUT
  if (currentPublishedSlug && currentPublishedSlug === desiredSlug) {
    const publication = createPublication(document);
    const content = serializePublication(publication);
    const transport = new GitHubPublicationTransport();
    await transport.deliver(content, publication.contentType, publication.slug);
    return { publicationPath: `content/published/${publication.contentType}/${desiredSlug}.json`, publishedSlug: desiredSlug };
  }

  // Slug has changed (or first publish): PUT new -> DELETE old
  const publication = createPublication(document);
  const content = serializePublication(publication);
  const transport = new GitHubPublicationTransport();

  // Step 1: PUT the new file
  await transport.deliver(content, publication.contentType, desiredSlug);

  // Step 2: If there was a previous published slug and it's different, delete the old file
  if (currentPublishedSlug && currentPublishedSlug !== desiredSlug) {
    await transport.remove(publication.contentType, currentPublishedSlug);
  }

  // Success: return the new slug so the caller can update publishedSlug
  return { publicationPath: `content/published/${publication.contentType}/${desiredSlug}.json`, publishedSlug: desiredSlug };
}

export async function deletePublishedDocument(
  document: Document
): Promise<void> {
  // Use publishedSlug for deletion - this is the authoritative last-published identity
  const slugToDelete = document.publishedSlug ?? getPublishSlug(document);
  if (!slugToDelete) {
    return; // Nothing to delete
  }
  const publication = createPublication(document);
  const transport = new GitHubPublicationTransport();
  await transport.remove(publication.contentType, slugToDelete);
}