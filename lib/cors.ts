const ALLOWED_ORIGINS = new Set([
  "http://localhost:3001",
  "https://thelongwayhome.dev",
  "https://www.thelongwayhome.dev",
]);

export function getCorsHeaders(
  request: Request,
) {
  const origin =
    request.headers.get("Origin");

  const headers = new Headers();

  if (
    origin &&
    ALLOWED_ORIGINS.has(origin)
  ) {
    headers.set(
      "Access-Control-Allow-Origin",
      origin,
    );

    headers.set(
      "Access-Control-Allow-Methods",
      "POST, OPTIONS",
    );

    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type",
    );

    headers.set(
      "Vary",
      "Origin",
    );
  }

  return headers;
}