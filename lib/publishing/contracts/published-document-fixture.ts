import type { PublishedDocument } from "./published-document";

export const studioTestPublication: PublishedDocument = {
  contractVersion: "0.1",

  id: "studio-test",

  contentType: "journal",

  slug: "studio-test",

  publishedAt: "2026-08-13T00:00:00.000Z",

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
          "We are testing the new Studio publishing workflow.",
      },
    },
    {
      id: "paragraph-2",
      type: "paragraph",
      data: {
        text:
          "The goal is to keep Studio responsible for what is published while the website remains responsible for how it is rendered.",
      },
    },
  ],
};