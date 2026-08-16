import { NextRequest } from "next/server";

import {
  consumeHandoffToken,
  isAuthenticated,
} from "@/lib/auth";

export async function GET(
  request: NextRequest,
) {
  const token =
    request.nextUrl.searchParams.get(
      "token",
    );

  if (!token) {
    return Response.redirect(
      new URL(
        "/login?auth=failed",
        request.url,
      ),
    );
  }

  const sessionToken =
    await consumeHandoffToken(token);

  if (!sessionToken) {
    return Response.redirect(
      new URL(
        "/login?auth=failed",
        request.url,
      ),
    );
  }

  const authenticated =
    await isAuthenticated(
      sessionToken,
    );

  if (!authenticated) {
    return Response.redirect(
      new URL(
        "/login?auth=failed",
        request.url,
      ),
    );
  }

  const destination =
    new URL("/", request.url);

  return new Response(null, {
    status: 302,
    headers: {
      Location: destination.toString(),
      "Set-Cookie": [
        `workshop_session=${sessionToken}`,
        "Path=/",
        "HttpOnly",
        "Secure",
        "SameSite=Lax",
        "Max-Age=86400",
      ].join("; "),
    },
  });
}