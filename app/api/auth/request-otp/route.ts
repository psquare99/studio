import { NextRequest } from "next/server";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
  createOtpChallenge,
  verifyWorkshopSecret,
} from "@/lib/auth";

import { getCorsHeaders } from "@/lib/cors";

function json(
  request: NextRequest,
  data: unknown,
  init?: ResponseInit,
) {
  const headers = new Headers(init?.headers);

  const corsHeaders =
    getCorsHeaders(request);

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
        secret?: unknown;
      };

    const secret =
      typeof body.secret === "string"
        ? body.secret
        : "";

    const valid =
      await verifyWorkshopSecret(
        secret,
      );

    if (!valid) {
      return json(
        request,
        {
          error:
            "Nice try. The chimney smoke says otherwise.",
        },
        { status: 401 },
      );
    }

    const {
      challengeId,
      otp,
    } = await createOtpChallenge();

    const { env } =
      getCloudflareContext();

    const apiKey =
      env.RESEND_API_KEY;

    const from =
      env.WORKSHOP_FROM;

    const to =
      env.WORKSHOP_EMAIL;

    if (!apiKey || !from || !to) {
      throw new Error(
        "Email authentication is not configured.",
      );
    }

    const response =
      await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${apiKey}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            from,
            to: [to],
            subject:
              "Your Long Way Home Workshop code",
            html: `
              <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
                <h2>The Long Way Home Workshop</h2>

                <p>
                  Someone is trying to open the Workshop.
                </p>

                <p>
                  Your verification code is:
                </p>

                <div style="
                  font-size: 32px;
                  font-weight: 700;
                  letter-spacing: 8px;
                  margin: 24px 0;
                ">
                  ${otp}
                </div>

                <p>
                  This code expires in 10 minutes.
                </p>

                <p style="color: #777;">
                  If you didn't request this code,
                  you can safely ignore this email.
                </p>
              </div>
            `,
          }),
        },
      );

    if (!response.ok) {
      const error =
        await response.text();

      console.error(
        "Resend error:",
        error,
      );

      return json(
        request,
        {
          error:
            "Unable to send the verification email.",
        },
        { status: 500 },
      );
    }

    return json(
      request,
      {
        success: true,
        challengeId,
      },
    );
  } catch (error) {
    console.error(error);

    return json(
      request,
      {
        error:
          "Something went wrong while starting authentication.",
      },
      { status: 500 },
    );
  }
}