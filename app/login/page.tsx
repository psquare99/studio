"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<"secret" | "otp">("secret");
  const [secret, setSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestOtp(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/auth/request-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ secret }),
        },
      );

      const data = (await response.json()) as {
  error?: string;
  challengeId?: string;
};

      if (!response.ok) {
        setMessage(
          data.error ?? "Unable to continue.",
        );
        return;
      }

      setChallengeId(data.challengeId ?? "");
      setStep("otp");
      setMessage(
        "The code has been sent to your email.",
      );
    } catch {
      setMessage(
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            challengeId,
            otp,
          }),
        },
      );

      const data = (await response.json()) as {
  error?: string;
};

      if (!response.ok) {
        setMessage(
          data.error ?? "Unable to verify the code.",
        );
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setMessage(
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
        <div className="w-full">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-400">
              Workshop
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900">
              The Long Way Home
            </h1>

            <p className="mt-3 text-neutral-500">
              A quiet place for things worth making.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            {step === "secret" ? (
              <form
                onSubmit={requestOtp}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">
                    The door is locked.
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    Enter the Workshop code to begin
                    authentication.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="secret"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Workshop code
                  </label>

                  <input
                    id="secret"
                    type="password"
                    value={secret}
                    onChange={(event) =>
                      setSecret(event.target.value)
                    }
                    autoFocus
                    autoComplete="off"
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 outline-none transition focus:border-neutral-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-neutral-900 px-4 py-3 font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Checking..."
                    : "Continue"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={verifyCode}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">
                    Check your email.
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    We sent a six-digit verification
                    code to your Workshop email address.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Verification code
                  </label>

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6),
                      )
                    }
                    autoFocus
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none transition focus:border-neutral-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full rounded-xl bg-neutral-900 px-4 py-3 font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Verifying..."
                    : "Open Workshop"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("secret");
                    setOtp("");
                    setChallengeId("");
                    setMessage("");
                  }}
                  className="w-full text-sm text-neutral-500 hover:text-neutral-900"
                >
                  ← Start again
                </button>
              </form>
            )}

            {message && (
              <p
                className="mt-5 text-center text-sm text-neutral-500"
                aria-live="polite"
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}