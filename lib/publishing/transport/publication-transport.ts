export interface PublicationTransport {
  deliver(
    artifactPath: string,
    contentType: string,
    slug: string
  ): string;

  remove(
    contentType: string,
    slug: string
  ): void;
}