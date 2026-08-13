import { createPublication } from "@/services/publishing-service";

import { writePublication } from "./publication-writer";

import type { Document } from "@/lib/models/document";

const testDocument: Document = {
  id: "studio-test",

  workspaceId: "the-long-way-home",

  contentTypeId: "journal",

  metadata: {
    title: "Studio Test",
    excerpt: "Testing the new publishing workflow.",
    category: "dev-logs",
  },

  blocks: [
    {
      id: "paragraph-1",
      type: "paragraph",
      data: {
        text:
          "This journal entry was created in Studio.",
      },
    },
    {
      id: "paragraph-2",
      type: "paragraph",
      data: {
        text:
          "Studio knows what to publish. The website knows how to publish it.",
      },
    },
  ],

  status: "published",

  publishedAt:
    "2026-08-13T00:00:00.000Z",

  updatedAt:
    "2026-08-13T00:00:00.000Z",
};

const publication =
  createPublication(testDocument);

const filePath =
  writePublication(publication);

console.log(
  `Publication written to: ${filePath}`
);