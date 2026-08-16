import { NextRequest } from "next/server";

import { verifyOtp } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
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
      return Response.json(
        {
          error: "Enter the verification code.",
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

      return Response.json(
        {
          error: messages[result.reason],
        },
        { status: 401 },
      );
    }

    const response = Response.json({
      success: true,
    });

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

    return Response.json(
      {
        error:
          "Unable to verify the code.",
      },
      { status: 500 },
    );
  }
}