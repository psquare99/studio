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
        type: "select",
        required: false,
        placeholder: "Choose a category",
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
    description: "A structured project page",

    metadata: [
      {
        id: "slug",
        label: "Slug",
        type: "text",
        required: true,
        placeholder: "my-project",
      },

      {
        id: "title",
        label: "Title",
        type: "text",
        required: true,
        placeholder: "Project name",
      },

      {
        id: "tagline",
        label: "Tagline",
        type: "text",
        required: true,
        placeholder: "A short description",
      },

      {
        id: "summary",
        label: "Summary",
        type: "text",
        required: true,
        placeholder: "A concise project summary",
      },

      {
        id: "category",
        label: "Category",
        type: "select",
        required: true,
        placeholder: "Choose a category",
        options: [
          {
            value: "App",
            label: "App",
          },
          {
            value: "Website",
            label: "Website",
          },
          {
            value: "Game",
            label: "Game",
          },
          {
            value: "Tool",
            label: "Tool",
          },
          {
            value: "Experiment",
            label: "Experiment",
          },
        ],
      },

      {
        id: "status",
        label: "Status",
        type: "select",
        required: true,
        placeholder: "Choose a status",
        options: [
          {
            value: "building",
            label: "Building",
          },
          {
            value: "completed",
            label: "Completed",
          },
          {
            value: "archived",
            label: "Archived",
          },
        ],
      },

      {
        id: "accentColor",
        label: "Accent Color",
        type: "text",
        required: true,
        placeholder: "#3B82F6",
      },

      {
        id: "featured",
        label: "Featured",
        type: "boolean",
        required: false,
      },

      {
        id: "logo",
        label: "Logo",
        type: "image",
        required: true,
        placeholder: "/images/projects/example/logo.png",
      },

      {
        id: "primaryImage",
        label: "Primary Image",
        type: "image",
        required: true,
        placeholder: "/images/projects/example/primary.png",
      },

      {
        id: "secondaryImage",
        label: "Secondary Image",
        type: "image",
        required: true,
        placeholder: "/images/projects/example/secondary.png",
      },

      {
        id: "overview",
        label: "Overview",
        type: "text",
        required: true,
        placeholder: "What is this project?",
      },

      {
        id: "why",
        label: "Why I Built This",
        type: "text",
        required: true,
        placeholder: "Why did you build it?",
      },

      {
        id: "techStack",
        label: "Tech Stack",
        type: "list",
        required: false,
        placeholder: "Add a technology",
      },

      {
        id: "features",
        label: "Features",
        type: "list",
        required: false,
        placeholder: "Add a feature",
      },

      {
        id: "challenges",
        label: "Challenges",
        type: "list",
        required: false,
        placeholder: "Add a challenge",
      },

      {
        id: "lessons",
        label: "Lessons Learned",
        type: "list",
        required: false,
        placeholder: "Add a lesson",
      },

      {
        id: "github",
        label: "GitHub",
        type: "text",
        required: false,
        placeholder: "https://github.com/...",
      },

      {
        id: "gallery",
        label: "Gallery",
        type: "text",
        required: false,
        placeholder: "/projects/example/gallery",
      },

      {
        id: "liveDemo",
        label: "Live Demo",
        type: "text",
        required: false,
        placeholder: "https://...",
      },

      {
        id: "platform",
        label: "Platform",
        type: "text",
        required: false,
        placeholder: "Android",
      },

      {
        id: "framework",
        label: "Framework",
        type: "text",
        required: false,
        placeholder: "Flutter",
      },

      {
        id: "started",
        label: "Started",
        type: "text",
        required: false,
        placeholder: "July 2026",
      },

      {
        id: "repository",
        label: "Repository",
        type: "select",
        required: false,
        placeholder: "Choose visibility",
        options: [
          {
            value: "public",
            label: "Public",
          },
          {
            value: "private",
            label: "Private",
          },
        ],
      },

      {
        id: "team",
        label: "Team",
        type: "text",
        required: false,
        placeholder: "Solo",
      },

      {
        id: "roadmap",
        label: "Roadmap",
        type: "list",
        required: false,
        placeholder: "Add a roadmap item",
      },

      {
        id: "version",
        label: "Version",
        type: "text",
        required: true,
        placeholder: "v1.0.0",
      },
    ],

    // Projects use structured metadata rather than free-form blocks.
    allowedBlocks: [],
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
      },
    ],

    allowedBlocks: [
      "paragraph",
      "image",
      "gallery",
    ],
  },
];

export function getSchema(
  id: string
): Schema | undefined {
  return schemas.find(
    (schema) => schema.id === id
  );
}