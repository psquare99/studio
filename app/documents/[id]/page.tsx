"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  loadEditorDocument,
  saveDocument,
} from "@/services/document-service";

import type { Document } from "@/lib/models/document";
import type { Schema } from "@/lib/models/schema";
import type { MetadataField } from "@/lib/models/metadata-field";

import BlockEditor from "@/components/editor/BlockEditor";

export default function DocumentPage() {
  const params = useParams();
  const id = params.id as string;

  const [document, setDocument] =
    useState<Document | null>(null);

  const [schema, setSchema] =
    useState<Schema | null>(null);

  const [metadata, setMetadata] =
    useState<Record<string, string>>({});

  const [blocks, setBlocks] =
    useState<Document["blocks"]>([]);

  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving"
  >("saved");

  const [publishStatus, setPublishStatus] =
    useState<
      "idle" | "publishing" | "published" | "error"
    >("idle");

  const hasLoaded = useRef(false);

  useEffect(() => {
    const editorDocument =
      loadEditorDocument(id);

    if (!editorDocument) {
      return;
    }

    const {
      document: loadedDocument,
      schema: loadedSchema,
    } = editorDocument;

    setDocument(loadedDocument);
    setSchema(loadedSchema);

    setMetadata({
      ...loadedDocument.metadata,
    });

    setBlocks([
      ...loadedDocument.blocks,
    ]);

    hasLoaded.current = true;
  }, [id]);

  useEffect(() => {
    if (
      !document ||
      !schema ||
      !hasLoaded.current
    ) {
      return;
    }

    setSaveStatus("saving");

    const timeout = window.setTimeout(() => {
      const updatedDocument: Document = {
        ...document,

        metadata: {
          ...metadata,
        },

        blocks: [
          ...blocks,
        ],

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
  }, [
    metadata,
    blocks,
  ]);

  function updateMetadata(
    fieldId: string,
    value: string
  ) {
    setMetadata((current) => ({
      ...current,
      [fieldId]: value,
    }));
  }

  function renderMetadataField(
    field: MetadataField
  ) {
    const value =
      metadata[field.id] ?? "";

    const commonClassName =
      "w-full border-none outline-none placeholder:text-neutral-300";

    if (field.id === "title") {
      return (
        <input
          key={field.id}
          value={value}
          onChange={(event) =>
            updateMetadata(
              field.id,
              event.target.value
            )
          }
          placeholder={
            field.placeholder ??
            "Untitled"
          }
          required={field.required}
          className={`${commonClassName} text-6xl font-bold tracking-tight`}
        />
      );
    }

    if (field.id === "excerpt") {
      return (
        <input
          key={field.id}
          value={value}
          onChange={(event) =>
            updateMetadata(
              field.id,
              event.target.value
            )
          }
          placeholder={
            field.placeholder ??
            "A short description..."
          }
          required={field.required}
          className={`${commonClassName} mt-6 text-xl text-neutral-500`}
        />
      );
    }

    switch (field.type) {
      case "number":
        return (
          <div
            key={field.id}
            className="mt-8 space-y-2"
          >
            <label className="block text-sm font-medium text-neutral-500">
              {field.label}
              {field.required && (
                <span className="ml-1 text-neutral-400">
                  *
                </span>
              )}
            </label>

            <input
              type="number"
              value={value}
              onChange={(event) =>
                updateMetadata(
                  field.id,
                  event.target.value
                )
              }
              placeholder={
                field.placeholder
              }
              required={field.required}
              className={`${commonClassName} border-b border-neutral-200 pb-2 text-lg text-neutral-700`}
            />
          </div>
        );

      case "date":
        return (
          <div
            key={field.id}
            className="mt-8 space-y-2"
          >
            <label className="block text-sm font-medium text-neutral-500">
              {field.label}
              {field.required && (
                <span className="ml-1 text-neutral-400">
                  *
                </span>
              )}
            </label>

            <input
              type="date"
              value={value}
              onChange={(event) =>
                updateMetadata(
                  field.id,
                  event.target.value
                )
              }
              required={field.required}
              className={`${commonClassName} border-b border-neutral-200 pb-2 text-lg text-neutral-700`}
            />
          </div>
        );

      case "boolean":
        return (
          <label
            key={field.id}
            className="mt-8 flex items-center gap-3 text-sm text-neutral-700"
          >
            <input
              type="checkbox"
              checked={value === "true"}
              onChange={(event) =>
                updateMetadata(
                  field.id,
                  event.target.checked
                    ? "true"
                    : "false"
                )
              }
            />

            <span>
              {field.label}
            </span>
          </label>
        );

      case "text":
      default:
        return (
          <div
            key={field.id}
            className="mt-8 space-y-2"
          >
            <label className="block text-sm font-medium text-neutral-500">
              {field.label}
              {field.required && (
                <span className="ml-1 text-neutral-400">
                  *
                </span>
              )}
            </label>

            <input
              type="text"
              value={value}
              onChange={(event) =>
                updateMetadata(
                  field.id,
                  event.target.value
                )
              }
              placeholder={
                field.placeholder
              }
              required={field.required}
              className={`${commonClassName} border-b border-neutral-200 pb-2 text-lg text-neutral-700`}
            />
          </div>
        );
    }
  }

  async function handlePublish() {
    if (!document) {
      return;
    }

    try {
      setPublishStatus("publishing");

      const publishedDocument: Document = {
        ...document,

        metadata: {
          ...metadata,
        },

        blocks: [
          ...blocks,
        ],

        status: "published",

        publishedAt:
          document.publishedAt ??
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),
      };

      const response = await fetch(
        `/api/documents/${id}/publish`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            publishedDocument
          ),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Publishing request failed."
        );
      }

      saveDocument(
        publishedDocument
      );

      setDocument(
        publishedDocument
      );

      setPublishStatus(
        "published"
      );
    } catch (error) {
      console.error(
        "Failed to publish document:",
        error
      );

      setPublishStatus("error");
    }
  }

  if (!document || !schema) {
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
                disabled={
                  publishStatus ===
                  "publishing"
                }
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {publishStatus ===
                "publishing"
                  ? "Publishing..."
                  : "Publish"}
              </button>
            )}

            {document.status ===
              "published" && (
              <span className="rounded-xl bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-700">
                {publishStatus === "error"
                  ? "Publish failed"
                  : "Published"}
              </span>
            )}

            {publishStatus === "error" &&
              document.status === "draft" && (
                <span className="text-sm text-red-500">
                  Publish failed
                </span>
              )}
          </div>
        </div>

        <div className="mt-16">

          {schema.metadata.map(
            renderMetadataField
          )}

          <BlockEditor
            blocks={blocks}
            allowedBlocks={
              schema.allowedBlocks
            }
            onChange={setBlocks}
          />

        </div>

      </div>
    </main>
  );
}