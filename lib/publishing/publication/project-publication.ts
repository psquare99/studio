import type { Document } from "@/lib/models/document";
import type { PublishedDocument } from "../contracts/published-document";

function getText(
  value: Document["metadata"][string]
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function parseList(
  value: Document["metadata"][string]
): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string =>
        typeof item === "string"
    );
  }

  if (typeof value !== "string") {
    return [];
  }

  if (!value.trim()) {
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

function getBoolean(
  value: Document["metadata"][string]
): boolean {
  return (
    value === true ||
    value === "true"
  );
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
    getText(
      document.metadata.title
    );

  if (!title) {
    throw new Error(
      "A project must have a title before it can be published."
    );
  }

  const slug =
    getText(
      document.metadata.slug
    ) ||
    title
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );

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
      getText(
        document.metadata.tagline
      ),

    summary:
      getText(
        document.metadata.summary
      ),

    category:
      getText(
        document.metadata.category
      ),

    status:
      getText(
        document.metadata.status
      ) ||
      "building",

    accentColor:
      getText(
        document.metadata.accentColor
      ),

    featured:
      getBoolean(
        document.metadata.featured
      ),

    logo:
      getText(
        document.metadata.logo
      ),

    primaryImage:
      getText(
        document.metadata.primaryImage
      ),

    secondaryImage:
      getText(
        document.metadata.secondaryImage
      ),

    overview:
      getText(
        document.metadata.overview
      ),

    why:
      getText(
        document.metadata.why
      ),

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
      getText(
        document.metadata.github
      ) ||
      undefined,

    gallery:
      getText(
        document.metadata.gallery
      ) ||
      undefined,

    liveDemo:
      getText(
        document.metadata.liveDemo
      ) ||
      undefined,

    platform:
      getText(
        document.metadata.platform
      ) ||
      undefined,

    framework:
      getText(
        document.metadata.framework
      ) ||
      undefined,

    started:
      getText(
        document.metadata.started
      ) ||
      undefined,

    repository:
      getText(
        document.metadata.repository
      ) ||
      undefined,

    team:
      getText(
        document.metadata.team
      ) ||
      undefined,

    roadmap:
      parseList(
        document.metadata.roadmap
      ),

    version:
      getText(
        document.metadata.version
      ),
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