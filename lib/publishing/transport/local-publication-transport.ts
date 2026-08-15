import fs from "node:fs";
import path from "node:path";

import type { PublicationTransport } from "./publication-transport";

export class LocalPublicationTransport
  implements PublicationTransport
{
  constructor(
    private readonly destinationRoot: string
  ) {}

  async deliver(
  artifactPath: string,
  contentType: string,
  slug: string
): Promise<string> {
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

  async remove(
  contentType: string,
  slug: string
): Promise<void> {
    const destinationPath =
      path.join(
        this.destinationRoot,
        "content",
        "published",
        contentType,
        `${slug}.json`
      );

    if (
      fs.existsSync(destinationPath)
    ) {
      fs.unlinkSync(
        destinationPath
      );
    }
  }
}