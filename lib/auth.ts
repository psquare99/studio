import { getCloudflareContext } from "@opennextjs/cloudflare";

const OTP_TTL_SECONDS = 10 * 60;
const SESSION_TTL_SECONDS = 24 * 60 * 60;
const HANDOFF_TTL_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;

function getEnv() {
  const { env } = getCloudflareContext();

  return env as CloudflareEnv;
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function randomToken(length = 32) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function generateOtp() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  return String(100000 + (array[0] % 900000));
}

export async function verifyWorkshopSecret(secret: string) {
  const env = getEnv();

  if (!env.WORKSHOP_SECRET) {
    throw new Error(
      "WORKSHOP_SECRET is not configured.",
    );
  }

  return secret.trim() === env.WORKSHOP_SECRET;
}

export async function createOtpChallenge() {
  const env = getEnv();

  const otp = generateOtp();
  const challengeId = randomToken(16);
  const otpHash = await sha256(otp);

  await env.WORKSHOP_AUTH.put(
    `otp:${challengeId}`,
    JSON.stringify({
      hash: otpHash,
      attempts: 0,
      createdAt: Date.now(),
    }),
    {
      expirationTtl: OTP_TTL_SECONDS,
    },
  );

  return {
    challengeId,
    otp,
  };
}

export async function verifyOtp(
  challengeId: string,
  otp: string,
) {
  const env = getEnv();

  const key = `otp:${challengeId}`;
  const stored = await env.WORKSHOP_AUTH.get(key);

  if (!stored) {
    return {
      success: false,
      reason: "expired",
    } as const;
  }

  const challenge = JSON.parse(stored) as {
    hash: string;
    attempts: number;
    createdAt: number;
  };

  if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
    await env.WORKSHOP_AUTH.delete(key);

    return {
      success: false,
      reason: "locked",
    } as const;
  }

  const suppliedHash = await sha256(otp.trim());

  if (suppliedHash !== challenge.hash) {
    challenge.attempts += 1;

    await env.WORKSHOP_AUTH.put(
      key,
      JSON.stringify(challenge),
      {
        expirationTtl: OTP_TTL_SECONDS,
      },
    );

    return {
      success: false,
      reason: "invalid",
    } as const;
  }

  await env.WORKSHOP_AUTH.delete(key);

  const sessionToken = randomToken(32);

  await env.WORKSHOP_AUTH.put(
    `session:${sessionToken}`,
    JSON.stringify({
      authenticatedAt: Date.now(),
    }),
    {
      expirationTtl: SESSION_TTL_SECONDS,
    },
  );

  return {
    success: true,
    sessionToken,
  } as const;
}

export async function createHandoffToken(
  sessionToken: string,
) {
  const env = getEnv();

  const handoffToken = randomToken(32);

  await env.WORKSHOP_AUTH.put(
    `handoff:${handoffToken}`,
    JSON.stringify({
      sessionToken,
      createdAt: Date.now(),
    }),
    {
      expirationTtl: HANDOFF_TTL_SECONDS,
    },
  );

  return handoffToken;
}

export async function consumeHandoffToken(
  handoffToken: string,
) {
  const env = getEnv();

  const key = `handoff:${handoffToken}`;

  const stored =
    await env.WORKSHOP_AUTH.get(key);

  if (!stored) {
    return null;
  }

  await env.WORKSHOP_AUTH.delete(key);

  const handoff = JSON.parse(stored) as {
    sessionToken: string;
    createdAt: number;
  };

  return handoff.sessionToken;
}
export async function isAuthenticated(
  sessionToken: string | undefined,
) {
  if (!sessionToken) {
    return false;
  }

  const env = getEnv();

  const session = await env.WORKSHOP_AUTH.get(
    `session:${sessionToken}`,
  );

  return Boolean(session);
}

export async function destroySession(
  sessionToken: string | undefined,
) {
  if (!sessionToken) {
    return;
  }

  const env = getEnv();

  await env.WORKSHOP_AUTH.delete(
    `session:${sessionToken}`,
  );
}