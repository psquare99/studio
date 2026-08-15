import type { Document } from "@/lib/models/document";
import type { PublishedDocument } from "../contracts/published-document";

function parseList(
  value?: string
): string[] {
  if (!value?.trim()) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is string =>
          typeof item === "string"
      );
    }
  } catch {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function createProjectPublication(
  document: Document
): PublishedDocument {
  if (
    document.status !== "published" &&
    document.status !== "modified"
  ) {
    throw new Error(
      "Only published or modified projects can be published."
    );
  }

  if (
    document.contentTypeId !==
    "project"
  ) {
    throw new Error(
      `Cannot publish content type "${document.contentTypeId}" as a project.`
    );
  }

  const title =
    document.metadata.title?.trim();

  if (!title) {
    throw new Error(
      "A project must have a title before it can be published."
    );
  }

  const slug =
    document.metadata.slug?.trim() ||
    title
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        "");

  if (!slug) {
    throw new Error(
      "A valid project slug could not be generated."
    );
  }

  const metadata: Record<
    string,
    unknown
  > = {
    slug,

    title,

    tagline:
      document.metadata.tagline?.trim() ??
      "",

    summary:
      document.metadata.summary?.trim() ??
      "",

    category:
      document.metadata.category?.trim() ??
      "",

    status:
      document.metadata.status?.trim() ??
      "building",

    accentColor:
      document.metadata.accentColor?.trim() ??
      "",

    featured:
      document.metadata.featured ===
      "true",

    logo:
      document.metadata.logo?.trim() ??
      "",

    primaryImage:
      document.metadata.primaryImage?.trim() ??
      "",

    secondaryImage:
      document.metadata.secondaryImage?.trim() ??
      "",

    overview:
      document.metadata.overview?.trim() ??
      "",

    why:
      document.metadata.why?.trim() ??
      "",

    techStack:
      parseList(
        document.metadata.techStack
      ),

    features:
      parseList(
        document.metadata.features
      ),

    challenges:
      parseList(
        document.metadata.challenges
      ),

    lessons:
      parseList(
        document.metadata.lessons
      ),

    github:
      document.metadata.github?.trim() ||
      undefined,

    gallery:
      document.metadata.gallery?.trim() ||
      undefined,

    liveDemo:
      document.metadata.liveDemo?.trim() ||
      undefined,

    platform:
      document.metadata.platform?.trim() ||
      undefined,

    framework:
      document.metadata.framework?.trim() ||
      undefined,

    started:
      document.metadata.started?.trim() ||
      undefined,

    repository:
      document.metadata.repository?.trim() ||
      undefined,

    team:
      document.metadata.team?.trim() ||
      undefined,

    roadmap:
      parseList(
        document.metadata.roadmap
      ),

    version:
      document.metadata.version?.trim() ??
      "",
  };

  return {
    contractVersion: "0.1",

    id: document.id,

    contentType: "project",

    slug,

    publishedAt:
      document.publishedAt ??
      document.updatedAt,

    metadata,

    blocks: [],
  };
}