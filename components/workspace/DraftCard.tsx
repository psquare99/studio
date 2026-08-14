"use client";

import Link from "next/link";

import type { DocumentStatus } from "@/lib/models/document";

interface DraftCardProps {
  id: string;
  title: string;
  excerpt?: string;
  updatedAt: string;
  status: DocumentStatus;
  onDelete: (id: string) => void;
}

export default function DraftCard({
  id,
  title,
  excerpt,
  updatedAt,
  status,
  onDelete,
}: DraftCardProps) {
  function handleDelete(
    event: React.MouseEvent
  ) {
    event.preventDefault();
    event.stopPropagation();

    const confirmed =
      window.confirm(
        status === "draft"
          ? `Delete "${title}"?`
          : `Delete "${title}" and remove its published version from the website?`
      );

    if (!confirmed) {
      return;
    }

    onDelete(id);
  }

  return (
    <Link
      href={`/documents/${id}`}
      className="group block rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-semibold text-neutral-900">
            {title}
          </h3>

          {excerpt && (
            <p className="mt-2 line-clamp-2 text-neutral-500">
              {excerpt}
            </p>
          )}

          <p className="mt-4 text-sm text-neutral-400">
            {new Date(
              updatedAt
            ).toLocaleDateString()}
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleDelete
          }
          aria-label={`Delete ${title}`}
          className="
            shrink-0
            rounded-xl
            px-3
            py-2
            text-sm
            text-neutral-400
            opacity-0
            transition
            group-hover:opacity-100
            hover:bg-red-50
            hover:text-red-600
          "
        >
          Delete
        </button>
      </div>

      <div className="mt-4">
        {status ===
          "modified" && (
          <span className="text-xs font-medium text-amber-600">
            Modified
          </span>
        )}

        {status ===
          "published" && (
          <span className="text-xs font-medium text-neutral-500">
            Published
          </span>
        )}

        {status ===
          "draft" && (
          <span className="text-xs font-medium text-neutral-400">
            Draft
          </span>
        )}
      </div>
    </Link>
  );
}