"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { createNewDocument } from "@/services/document-service";

export default function NewDocumentPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const contentTypeId = params.get("type") ?? "journal";

    const document = createNewDocument(
      "the-long-way-home",
      contentTypeId
    );

    router.replace(`/documents/${document.id}`);
  }, [router]);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-3xl px-8 py-24">
        <p className="text-lg text-neutral-500">
          Opening a new journal...
        </p>
      </div>
    </main>
  );
}