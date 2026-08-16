import { NextRequest } from "next/server";

import {
  createHandoffToken,
  verifyOtp,
} from "@/lib/auth";
import { getCorsHeaders } from "@/lib/cors";

function json(
  request: NextRequest,
  data: unknown,
  init?: ResponseInit,
) {
  const headers = new Headers(init?.headers);
  const corsHeaders = getCorsHeaders(request);

  corsHeaders.forEach((value, key) => {
    headers.set(key, value);
  });

  return Response.json(data, {
    ...init,
    headers,
  });
}

export async function OPTIONS(
  request: NextRequest,
) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as {
        challengeId?: unknown;
        otp?: unknown;
      };

    const challengeId =
      typeof body.challengeId === "string"
        ? body.challengeId
        : "";

    const otp =
      typeof body.otp === "string"
        ? body.otp
        : "";

    if (!challengeId || !otp) {
      return json(
        request,
        {
          error:
            "Enter the verification code.",
        },
        { status: 400 },
      );
    }

    const result = await verifyOtp(
      challengeId,
      otp,
    );

    if (!result.success) {
      const messages = {
        expired:
          "That code has expired. Please request a new one.",
        locked:
          "Too many attempts. Please request a new code.",
        invalid:
          "That code isn't correct.",
      };

      return json(
        request,
        {
          error: messages[result.reason],
        },
        { status: 401 },
      );
    }

    const handoffToken =
      await createHandoffToken(
        result.sessionToken,
      );

    const response = json(
      request,
      {
        success: true,
        handoffToken,
      },
    );

    response.headers.set(
      "Set-Cookie",
      [
        `workshop_session=${result.sessionToken}`,
        "Path=/",
        "HttpOnly",
        "Secure",
        "SameSite=Lax",
        "Max-Age=86400",
      ].join("; "),
    );

    return response;
  } catch (error) {
    console.error(error);

    return json(
      request,
      {
        error:
          "Unable to verify the code.",
      },
      { status: 500 },
    );
  }
}