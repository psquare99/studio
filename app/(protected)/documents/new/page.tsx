"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Document } from "@/lib/models/document";

export default function NewDocumentPage() {
  const router = useRouter();

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const contentTypeId = params.get("type") ?? "journal";

    async function create() {
      try {
        const response = await fetch(
          "/api/documents",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              workspaceId:
                "the-long-way-home",
              contentTypeId,
            }),
          },
        );

        if (!response.ok) {
          throw new Error();
        }

        const result =
          (await response.json()) as {
            document?: Document;
          };

        if (!result.document?.id) {
          throw new Error();
        }

        router.replace(
          `/documents/${result.document.id}`,
        );
      } catch {
        setError(
          "The document could not be created."
        );
      }
    }

    create();
  }, [router]);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-3xl px-8 py-24">
        <p className="text-lg text-neutral-500">
          {error ??
            "Opening a new journal..."}
        </p>
      </div>
    </main>
  );
}
