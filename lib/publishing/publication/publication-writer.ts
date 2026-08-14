import fs from "node:fs";
import path from "node:path";

import type { PublishedDocument } from "../contracts/published-document";

const PUBLICATION_ROOT = path.join(
  process.cwd(),
  "publications"
);

export function serializePublication(
  publication: PublishedDocument
): string {
  return JSON.stringify(
    publication,
    null,
    2
  );
}

export function getPublicationPath(
  publication: PublishedDocument
): string {
  return path.join(
    PUBLICATION_ROOT,
    publication.contentType,
    `${publication.slug}.json`
  );
}

export function writePublication(
  publication: PublishedDocument
): string {
  const filePath =
    getPublicationPath(publication);

  const directory =
    path.dirname(filePath);

  fs.mkdirSync(directory, {
    recursive: true,
  });

  fs.writeFileSync(
    filePath,
    serializePublication(publication),
    "utf-8"
  );

  return filePath;
}
export function deletePublication(
  publication: PublishedDocument
): void {
  const filePath =
    getPublicationPath(publication);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}