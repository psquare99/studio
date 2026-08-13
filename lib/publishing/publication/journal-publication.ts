import type { Document } from "@/lib/models/document";
import type { PublishedDocument } from "../contracts/published-document";

export function createJournalPublication(
  document: Document
): PublishedDocument {
  if (document.status !== "published") {
    throw new Error(
      "Only published documents can be published."
    );
  }

  if (document.contentTypeId !== "journal") {
    throw new Error(
      `Cannot publish content type "${document.contentTypeId}" as a journal.`
    );
  }

  const title = document.metadata.title?.trim();

  if (!title) {
    throw new Error(
      "A journal must have a title before it can be published."
    );
  }

  const slug =
    document.metadata.slug?.trim() ||
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error(
      "A valid slug could not be generated."
    );
  }

  return {
    contractVersion: "0.1",

    id: document.id,

    contentType: "journal",

    slug,

    publishedAt:
  document.publishedAt ??
  document.updatedAt,

    metadata: {
      title,

      ...(document.metadata.excerpt
        ? {
            excerpt:
              document.metadata.excerpt.trim(),
          }
        : {}),

      ...(document.metadata.category
        ? {
            category:
              document.metadata.category.trim(),
          }
        : {}),

      ...(document.metadata.location
        ? {
            location:
              document.metadata.location.trim(),
          }
        : {}),

      ...(document.metadata.featured === "true"
        ? {
            featured: true,
          }
        : {}),
    },

    blocks: document.blocks.map((block) => ({
      id: block.id,

      type: block.type,

      data: block.data,
    })),
  };
}