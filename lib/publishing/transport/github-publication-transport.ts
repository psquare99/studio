import type { PublicationTransport } from "./publication-transport";

interface GitHubContentResponse {
  content?: {
    sha?: string;
  };
  sha?: string;
}

export class GitHubPublicationTransport
  implements PublicationTransport
{
  private readonly token: string;
  private readonly owner: string;
  private readonly repo: string;
  private readonly branch: string;

  constructor() {
    const token =
      process.env.GITHUB_TOKEN;

    const owner =
      process.env.GITHUB_OWNER;

    const repo =
      process.env.GITHUB_REPO;

    const branch =
      process.env.GITHUB_BRANCH ??
      "main";

    if (!token) {
      throw new Error(
        "GITHUB_TOKEN is not configured."
      );
    }

    if (!owner) {
      throw new Error(
        "GITHUB_OWNER is not configured."
      );
    }

    if (!repo) {
      throw new Error(
        "GITHUB_REPO is not configured."
      );
    }

    this.token = token;
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
  }

  private getApiUrl(
    filePath: string
  ): string {
    return (
      `https://api.github.com/repos/` +
      `${this.owner}/${this.repo}/contents/` +
      filePath
    );
  }

  private async getExistingSha(
    filePath: string
  ): Promise<string | undefined> {
    const response =
      await fetch(
        this.getApiUrl(filePath) +
          `?ref=${encodeURIComponent(
            this.branch
          )}`,
        {
          headers: {
            Accept:
              "application/vnd.github+json",
            Authorization:
              `Bearer ${this.token}`,
            "X-GitHub-Api-Version":
              "2022-11-28",
          },
        }
      );

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to inspect GitHub file: ${response.status} ${response.statusText}`
      );
    }

    const data =
      (await response.json()) as GitHubContentResponse;

    return (
      data.content?.sha ??
      data.sha
    );
  }

  async deliver(
    artifactPath: string,
    contentType: string,
    slug: string
  ): Promise<string> {
    const fs =
      await import("node:fs/promises");

    const content =
      await fs.readFile(
        artifactPath,
        "utf-8"
      );

    const filePath =
      `content/published/${contentType}/${slug}.json`;

    const existingSha =
      await this.getExistingSha(
        filePath
      );

    const body: Record<
      string,
      string
    > = {
      message:
        `Publish ${contentType}: ${slug}`,
      content:
        Buffer.from(
          content,
          "utf-8"
        ).toString("base64"),
      branch:
        this.branch,
    };

    if (existingSha) {
      body.sha = existingSha;
    }

    const response =
      await fetch(
        this.getApiUrl(filePath),
        {
          method: "PUT",

          headers: {
            Accept:
              "application/vnd.github+json",
            Authorization:
              `Bearer ${this.token}`,
            "Content-Type":
              "application/json",
            "X-GitHub-Api-Version":
              "2022-11-28",
          },

          body: JSON.stringify(
            body
          ),
        }
      );

    if (!response.ok) {
      const error =
        await response.text();

      throw new Error(
        `GitHub publication failed: ${response.status} ${error}`
      );
    }

    return filePath;
  }

  async remove(
    contentType: string,
    slug: string
  ): Promise<void> {
    const filePath =
      `content/published/${contentType}/${slug}.json`;

    const existingSha =
      await this.getExistingSha(
        filePath
      );

    if (!existingSha) {
      return;
    }

    const response =
      await fetch(
        this.getApiUrl(filePath),
        {
          method: "DELETE",

          headers: {
            Accept:
              "application/vnd.github+json",
            Authorization:
              `Bearer ${this.token}`,
            "Content-Type":
              "application/json",
            "X-GitHub-Api-Version":
              "2022-11-28",
          },

          body: JSON.stringify({
            message:
              `Remove ${contentType}: ${slug}`,
            sha: existingSha,
            branch:
              this.branch,
          }),
        }
      );

    if (!response.ok) {
      const error =
        await response.text();

      throw new Error(
        `GitHub publication deletion failed: ${response.status} ${error}`
      );
    }
  }
}