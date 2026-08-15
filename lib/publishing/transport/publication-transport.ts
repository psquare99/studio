export interface PublicationTransport {
  deliver(
    artifactPath: string,
    contentType: string,
    slug: string
  ): Promise<string>;

  remove(
    contentType: string,
    slug: string
  ): Promise<void>;
}