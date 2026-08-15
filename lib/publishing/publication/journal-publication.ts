import type { Document } from "@/lib/models/document";
import type { PublishedDocument } from "../contracts/published-document";

function getText(
  value: Document["metadata"][string]
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

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

  const title =
    getText(
      document.metadata.title
    );

  if (!title) {
    throw new Error(
      "A journal must have a title before it can be published."
    );
  }

  const slug =
    getText(
      document.metadata.slug
    ) ||
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

  const excerpt =
    getText(
      document.metadata.excerpt
    );

  const category =
    getText(
      document.metadata.category
    );

  const location =
    getText(
      document.metadata.location
    );

  const featured =
    document.metadata.featured === true ||
    document.metadata.featured === "true";

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

      ...(excerpt
        ? {
            excerpt,
          }
        : {}),

      ...(category
        ? {
            category,
          }
        : {}),

      ...(location
        ? {
            location,
          }
        : {}),

      ...(featured
        ? {
            featured: true,
          }
        : {}),
    },

    blocks: document.blocks.map(
      (block) => ({
        id: block.id,

        type: block.type,

        data: block.data,
      })
    ),
  };
}