"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  loadDocument,
  saveDocument,
} from "@/services/document-service";

export default function DocumentPage() {
  const params = useParams();
  const id = params.id as string;

  const [metadata, setMetadata] = useState<Record<string, string>>({});

  useEffect(() => {
    const document = loadDocument(id);

    if (!document) {
      return;
    }

    setMetadata(document.metadata);
  }, [id]);

  useEffect(() => {
    const document = loadDocument(id);

    if (!document) {
      return;
    }

    saveDocument({
      ...document,
      metadata,
      updatedAt: new Date().toISOString(),
    });
  }, [id, metadata]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-8 py-12">
        <Link
          href="/"
          className="mb-12 inline-block text-sm text-neutral-500 transition hover:text-black"
        >
          ← Workspace
        </Link>

        <input
          value={metadata.title ?? ""}
          onChange={(e) =>
            setMetadata({
              ...metadata,
              title: e.target.value,
            })
          }
          placeholder="Untitled"
          className="mt-8 w-full border-none text-7xl font-bold outline-none placeholder:text-neutral-400"
        />

        <div className="mt-10 rounded-xl border border-dashed border-neutral-300 p-8 text-neutral-500">
          Block editor coming soon...
        </div>
      </div>
    </main>
  );
}