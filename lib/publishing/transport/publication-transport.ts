export interface PublicationTransport {
  deliver(
    content: string,
    contentType: string,
    slug: string
  ): Promise<string>;

  remove(
    contentType: string,
    slug: string
  ): Promise<void>;
}