"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  loadDocument,
  saveDocument,
} from "@/services/document-service";

import type { Document } from "@/lib/models/document";

export default function DocumentPage() {
  const params = useParams();
  const id = params.id as string;

  const [document, setDocument] =
    useState<Document | null>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving"
  >("saved");

  const hasLoaded = useRef(false);

  useEffect(() => {
    const loadedDocument = loadDocument(id);

    if (!loadedDocument) {
      return;
    }

    setDocument(loadedDocument);

    setTitle(
      loadedDocument.metadata.title ?? ""
    );

    setExcerpt(
      loadedDocument.metadata.excerpt ?? ""
    );

    const text = loadedDocument.blocks
      .filter(
        (block) => block.type === "paragraph"
      )
      .map((block) => {
        const data = block.data as {
          text?: string;
        };

        return data.text ?? "";
      })
      .join("\n\n");

    setContent(text);

    hasLoaded.current = true;
  }, [id]);

  useEffect(() => {
    if (!document || !hasLoaded.current) {
      return;
    }

    setSaveStatus("saving");

    const timeout = window.setTimeout(() => {
      const existingParagraphs =
        document.blocks.filter(
          (block) =>
            block.type === "paragraph"
        );

      const blocks = content
        .split(/\n\s*\n/)
        .map((paragraph) =>
          paragraph.trim()
        )
        .filter(Boolean)
        .map((text, index) => ({
          id:
            existingParagraphs[index]?.id ??
            crypto.randomUUID(),

          type: "paragraph",

          data: {
            text,
          },
        }));

      const updatedDocument: Document = {
        ...document,

        metadata: {
          ...document.metadata,

          title,

          excerpt,
        },

        blocks,

        updatedAt:
          new Date().toISOString(),
      };

      saveDocument(updatedDocument);

      setDocument(updatedDocument);

      setSaveStatus("saved");
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [title, excerpt, content]);

  function handlePublish() {
    if (!document) {
      return;
    }

    const publishedDocument: Document = {
      ...document,

      status: "published",

      publishedAt:
        document.publishedAt ??
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };

    saveDocument(publishedDocument);

    setDocument(publishedDocument);
  }

  if (!document) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-8 py-24">
          <p className="text-neutral-500">
            Loading document...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-8 py-12">

        <div className="flex items-center justify-between">

          <Link
            href="/content/journal"
            className="text-sm text-neutral-500 transition hover:text-black"
          >
            ← Journal
          </Link>

          <div className="flex items-center gap-4">

            <span className="text-sm text-neutral-400">
              {saveStatus === "saving"
                ? "Saving..."
                : "Saved"}
            </span>

            {document.status === "draft" && (
              <button
                onClick={handlePublish}
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Publish
              </button>
            )}

            {document.status === "published" && (
              <span className="rounded-xl bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-700">
                Published
              </span>
            )}

          </div>

        </div>

        <div className="mt-16">

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Untitled"
            className="w-full border-none text-6xl font-bold tracking-tight outline-none placeholder:text-neutral-300"
          />

          <input
            value={excerpt}
            onChange={(e) =>
              setExcerpt(e.target.value)
            }
            placeholder="A short description..."
            className="mt-6 w-full border-none text-xl text-neutral-500 outline-none placeholder:text-neutral-300"
          />

          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Start writing..."
            className="mt-12 min-h-[500px] w-full resize-none border-none text-lg leading-8 text-neutral-700 outline-none placeholder:text-neutral-300"
          />

        </div>

      </div>
    </main>
  );
}