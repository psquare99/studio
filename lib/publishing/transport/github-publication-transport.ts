import { getCloudflareContext } from "@opennextjs/cloudflare";
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
  const { env } =
    getCloudflareContext();

  const token =
    env.GITHUB_TOKEN;

  const owner =
    env.GITHUB_OWNER;

  const repo =
    env.GITHUB_REPO;

  const branch =
    env.GITHUB_BRANCH ??
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
            "User-Agent": "The-Long-Way-Home-Studio",
          },
        }
      );

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
  const error = await response.text();

  throw new Error(
    `Failed to inspect GitHub file: ${response.status} ${response.statusText} ${error}`
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
    content: string,
    contentType: string,
    slug: string
  ): Promise<string> {
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
        btoa(
          unescape(
            encodeURIComponent(
              content
            )
          )
        ),

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
            "User-Agent": "The-Long-Way-Home-Studio",
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
            "User-Agent": "The-Long-Way-Home-Studio",
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