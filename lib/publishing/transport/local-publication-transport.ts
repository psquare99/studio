import fs from "node:fs";
import path from "node:path";

import type { PublicationTransport } from "./publication-transport";

export class LocalPublicationTransport
  implements PublicationTransport
{
  constructor(
    private readonly destinationRoot: string
  ) {}

  deliver(
    artifactPath: string,
    contentType: string,
    slug: string
  ): string {
    const destinationDirectory =
      path.join(
        this.destinationRoot,
        "content",
        "published",
        contentType
      );

    fs.mkdirSync(
      destinationDirectory,
      {
        recursive: true,
      }
    );

    const destinationPath =
      path.join(
        destinationDirectory,
        `${slug}.json`
      );

    fs.copyFileSync(
      artifactPath,
      destinationPath
    );

    return destinationPath;
  }
}