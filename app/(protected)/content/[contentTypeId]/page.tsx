"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { loadContentTypes } from "@/services/content-type-service";
import {
  loadRecentDocuments,
  removeDocument,
} from "@/services/document-service";

import DocumentList from "@/components/workspace/DocumentList";

import type { Document } from "@/lib/models/document";

const WORKSPACE_ID =
  "the-long-way-home";

export default function ContentTypePage() {
  const params = useParams();

  const contentTypeId =
    params.contentTypeId as string;

  const contentType =
    loadContentTypes(
      WORKSPACE_ID
    ).find(
      (type) =>
        type.id ===
        contentTypeId
    );

  const [documents, setDocuments] =
    useState<Document[]>([]);

 useEffect(() => {
  async function loadDocuments() {
    const recentDocuments =
      await loadRecentDocuments();

    const filteredDocuments =
      recentDocuments.filter(
        (document) =>
          document.workspaceId ===
            WORKSPACE_ID &&
          document.contentTypeId ===
            contentTypeId
      );

    setDocuments(
      filteredDocuments
    );
  }

  loadDocuments();
}, [contentTypeId]);

  async function handleDelete(
  id: string
) {
  const document =
    documents.find(
      (item) => item.id === id
    );

  if (!document) {
    return;
  }

  const isPublished =
    document.status ===
      "published" ||
    document.status ===
      "modified";

  if (isPublished) {
    try {
      const response =
        await fetch(
          `/api/documents/${id}/publish`,
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              document
            ),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to remove published document."
        );
      }
    } catch (error) {
      console.error(
        "Failed to unpublish document:",
        error
      );

      window.alert(
        "The published post could not be removed from the website. The document was kept in Studio."
      );

      return;
    }
  }

  await removeDocument(id);
  setDocuments(
    (current) =>
      current.filter(
        (item) =>
          item.id !== id
      )
  );
}

  if (!contentType) {
    return null;
  }

  const drafts =
    documents.filter(
      (document) =>
        document.status ===
        "draft"
    );

  const published =
    documents.filter(
      (document) =>
        document.status ===
          "published" ||
        document.status ===
          "modified"
    );

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-8 py-16">

        <div className="flex items-start justify-between gap-8">
          <div>
            <h1 className="text-5xl font-bold">
              {contentType.name}
            </h1>

            <p className="mt-3 text-lg text-neutral-500">
              {contentType.description}
            </p>
          </div>

          <Link
  href={`/documents/new?type=${contentTypeId}`}
  className="rounded-2xl bg-black px-6 py-3 text-white transition hover:bg-neutral-800"
>
  + New {contentType.name}
</Link>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold">
            Drafts
          </h2>

          <DocumentList
            documents={drafts}
            onDelete={
              handleDelete
            }
          />
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold">
            Published
          </h2>

          <DocumentList
            documents={
              published
            }
            onDelete={
              handleDelete
            }
          />
        </section>

      </div>
    </main>
  );
}