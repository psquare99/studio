import { Schema } from "@/lib/models/schema";

const schemas: Schema[] = [
  {
    id: "journal",
    name: "Journal",
    description: "Personal journal entries",

    metadata: [
  {
    id: "title",
    label: "Title",
    type: "text",
    required: true,
    placeholder: "Untitled",
  },
  {
    id: "excerpt",
    label: "Excerpt",
    type: "text",
    required: false,
    placeholder: "A short description...",
  },
  {
    id: "category",
    label: "Category",
    type: "text",
    required: false,
    placeholder: "e.g. dev-logs",
  },
],

    allowedBlocks: [
      "paragraph",
      "heading",
      "image",
      "quote",
    ],
  },

  {
    id: "project",
    name: "Project",
    description: "Software project",

    metadata: [
      {
  id: "title",
  label: "Title",
  type: "text",
  required: true,
  placeholder: "Untitled",
},
      {
        id: "platform",
        label: "Platform",
        type: "text",
        required: false,
      },
      {
        id: "version",
        label: "Version",
        type: "text",
        required: false,
      },
    ],

    allowedBlocks: [
      "paragraph",
      "heading",
      "image",
      "code",
    ],
  },

  {
    id: "tour",
    name: "Tour Package",
    description: "Tour package",

    metadata: [
      {
  id: "title",
  label: "Title",
  type: "text",
  required: true,
  placeholder: "Untitled",
},
      {
        id: "duration",
        label: "Duration",
        type: "text",
        required: true,
      },
      {
        id: "price",
        label: "Price",
        type: "text",
        required: true,
      },
    ],

    allowedBlocks: [
      "paragraph",
      "image",
      "quote",
    ],
  },

  {
    id: "destination",
    name: "Destination",
    description: "Destination page",

    metadata: [
      {
  id: "title",
  label: "Title",
  type: "text",
  required: true,
  placeholder: "Untitled",
},
    ],

    allowedBlocks: [
      "paragraph",
      "image",
      "gallery",
    ],
  },
];

export function getSchema(id: string): Schema | undefined {
  return schemas.find((schema) => schema.id === id);
}