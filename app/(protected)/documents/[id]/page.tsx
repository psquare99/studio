"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  loadSchemaForContentType,
} from "@/services/schema-service";

import type { Category } from "@/lib/models/category";
import type { Document } from "@/lib/models/document";
import type { Schema } from "@/lib/models/schema";
import type { MetadataField } from "@/lib/models/metadata-field";

import BlockEditor from "@/components/editor/BlockEditor";

function createContentFingerprint(
  metadata: Document["metadata"],
  blocks: Document["blocks"]
): string {
  return JSON.stringify({
    metadata,
    blocks,
  });
}

function parseList(
  value: unknown
): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string =>
        typeof item === "string"
    );
  }

  if (typeof value !== "string") {
    return [];
  }

  if (!value.trim()) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is string =>
          typeof item === "string"
      );
    }
  } catch {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function serializeList(
  items: string[]
): string[] {
  return items;
}

function stringValue(
  value: unknown
): string {
  return typeof value === "string"
    ? value
    : "";
}

export default function DocumentPage() {
  const params = useParams();

  const id =
    params.id as string;

  const [document, setDocument] =
    useState<Document | null>(null);

  const [schema, setSchema] =
    useState<Schema | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [metadata, setMetadata] =
    useState<Document["metadata"]>({});

  const [blocks, setBlocks] =
    useState<Document["blocks"]>([]);

  const [saveStatus, setSaveStatus] =
    useState<
      "saved" | "saving" | "failed"
    >("saved");

  const [saveError, setSaveError] =
    useState<string | null>(null);

  const [publishStatus, setPublishStatus] =
    useState<
      | "idle"
      | "publishing"
      | "published"
      | "error"
    >("idle");

  const saveGeneration = useRef(0);
  const pendingSaveRef = useRef<Promise<void> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [
    uploadingImageFieldId,
    setUploadingImageFieldId,
  ] = useState<string | null>(null);

  const [
    imageUploadError,
    setImageUploadError,
  ] = useState<string | null>(null);

  const hasLoaded =
    useRef(false);

  const lastSavedFingerprint =
    useRef<string>("");

  const [loadError, setLoadError] =
    useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response =
          await fetch(
            `/api/documents/${id}`
          );

        if (response.status === 404) {
          setLoadError(
            "This document could not be found."
          );

          return;
        }

        if (!response.ok) {
          throw new Error();
        }

        const result =
          (await response.json()) as {
            document?: Document;
          };

        const loadedDocument =
          result.document;

        if (!loadedDocument) {
          throw new Error();
        }

        const loadedSchema =
          loadSchemaForContentType(
            loadedDocument.workspaceId,
            loadedDocument.contentTypeId
          );

        if (!loadedSchema) {
          throw new Error();
        }

        setDocument(
          loadedDocument
        );

        setSchema(
          loadedSchema
        );

        setMetadata({
          ...loadedDocument.metadata,
        });

        setBlocks([
          ...loadedDocument.blocks,
        ]);

        const categoriesResponse =
          await fetch(
            `/api/categories?workspaceId=${encodeURIComponent(loadedDocument.workspaceId)}`
          );

        if (categoriesResponse.ok) {
          const categoriesResult =
            (await categoriesResponse.json()) as {
              categories?: Category[];
            };

          setCategories(
            categoriesResult.categories ??
              []
          );
        }

        lastSavedFingerprint.current =
          createContentFingerprint(
            loadedDocument.metadata,
            loadedDocument.blocks
          );

        hasLoaded.current = true;
      } catch {
        setLoadError(
          "The document could not be loaded."
        );
      }
    }

    load();
  }, [id]);

  useEffect(() => {
    if (
      !document ||
      !schema ||
      !hasLoaded.current
    ) {
      return;
    }

    const currentFingerprint =
      createContentFingerprint(
        metadata,
        blocks
      );

    const contentChanged =
      currentFingerprint !==
      lastSavedFingerprint.current;

    if (!contentChanged) {
      return;
    }

    setSaveStatus("saving");
    setSaveError(null);

    const timeout = window.setTimeout(
      async () => {
        timeoutRef.current = null;
        const promise = executeSave();
        pendingSaveRef.current = promise;
        await promise;
      },
      500
    ) as unknown as ReturnType<typeof setTimeout>;

    timeoutRef.current = timeout;

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [metadata, blocks, id, document?.status, document, executeSave, schema]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      const currentFingerprint = createContentFingerprint(metadata, blocks);
      const contentChanged =
        currentFingerprint !== lastSavedFingerprint.current;
      if (contentChanged) {
        event.preventDefault();
        event.returnValue = "";
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [metadata, blocks, document, schema]);

  async function executeSave(): Promise<void> {
    if (!document) {
      return;
    }
    const currentGen = saveGeneration.current + 1;
    saveGeneration.current = currentGen;

    const currentFingerprint = createContentFingerprint(metadata, blocks);

    const nextStatus =
      document.status === "published" ? "modified" : document.status;

    const updatedDocument: Document = {
      id: document.id,
      workspaceId: document.workspaceId,
      contentTypeId: document.contentTypeId,
      metadata: { ...metadata },
      blocks: [...blocks],
      status: nextStatus,
      updatedAt: new Date().toISOString(),
      ...(document.publishedAt ? { publishedAt: document.publishedAt } : {}),
    };

    setSaveStatus("saving");
    setSaveError(null);

    try {
      const response = await fetch(
        `/api/documents/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedDocument),
        });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(errorText || "Save failed");
      }

      if (saveGeneration.current !== currentGen) {
        return;
      }

      setDocument(updatedDocument);
      lastSavedFingerprint.current = currentFingerprint;
      setSaveStatus("saved");
      setSaveError(null);
    } catch (error) {
      if (saveGeneration.current !== currentGen) {
        return;
      }
      const message =
        error instanceof Error
          ? error.message
          : "Save failed";
      setSaveStatus("failed");
      setSaveError(message);
      throw error;
    }
  }

  async function flushPendingSave(): Promise<void> {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      await executeSave();
    }
    if (pendingSaveRef.current) {
      await pendingSaveRef.current;
      pendingSaveRef.current = null;
    }
  }

  function updateMetadata(
    fieldId: string,
    value:
      Document["metadata"][string]
  ) {
    setMetadata(
      (current) => ({
        ...current,
        [fieldId]:
          value,
      })
    );
  }

  async function uploadImage(
    field: MetadataField,
    file: File
  ) {
    setUploadingImageFieldId(
      field.id
    );

    setImageUploadError(null);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      const title =
        stringValue(
          metadata.title
        ).trim();

      const alt = [
        title,
        field.label,
      ]
        .filter(Boolean)
        .join(" ");

      formData.append(
        "alt",
        alt
      );

      const response = await fetch(
        "/api/media/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response
        .json()
        .catch(() => null) as {
          asset?: {
            url?: unknown;
          };
          error?: unknown;
        } | null;

      if (!response.ok) {
        throw new Error(
          typeof result?.error ===
            "string"
            ? result.error
            : "Image upload failed."
        );
      }

      const url = result?.asset?.url;

      if (typeof url !== "string" || !url) {
        throw new Error(
          "The upload did not return an image URL."
        );
      }

      updateMetadata(
        field.id,
        url
      );
    } catch (error) {
      setImageUploadError(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setUploadingImageFieldId(
        null
      );
    }
  }

  function updateListItem(
    fieldId: string,
    index: number,
    value: string
  ) {
    const current =
      parseList(
        metadata[fieldId]
      );

    current[index] =
      value;

    updateMetadata(
      fieldId,
      serializeList(
        current
      )
    );
  }

  function addListItem(
    fieldId: string
  ) {
    const current =
      parseList(
        metadata[fieldId]
      );

    updateMetadata(
      fieldId,
      [
        ...current,
        "",
      ]
    );
  }

  function removeListItem(
    fieldId: string,
    index: number
  ) {
    const current =
      parseList(
        metadata[fieldId]
      );

    current.splice(
      index,
      1
    );

    updateMetadata(
      fieldId,
      current
    );
  }

  function renderMetadataField(
    field: MetadataField
  ) {
    const value =
      metadata[field.id];

    const commonClassName =
      "w-full border-none outline-none placeholder:text-neutral-300";

    if (
      field.id === "title"
    ) {
      return (
        <input
          key={field.id}
          value={stringValue(
            value
          )}
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
          required={
            field.required
          }
          className={`${commonClassName} text-6xl font-bold tracking-tight`}
        />
      );
    }

    if (
      field.id === "tagline"
    ) {
      return (
        <input
          key={field.id}
          value={stringValue(
            value
          )}
          onChange={(event) =>
            updateMetadata(
              field.id,
              event.target.value
            )
          }
          placeholder={
            field.placeholder
          }
          required={
            field.required
          }
          className={`${commonClassName} mt-6 text-xl text-neutral-500`}
        />
      );
    }

    switch (field.type) {
      case "select":
        return (
          <div
            key={field.id}
            className="mt-8 space-y-2"
          >
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-neutral-500"
            >
              {field.label}

              {field.required && (
                <span className="ml-1 text-neutral-400">
                  *
                </span>
              )}
            </label>

            <select
              id={field.id}
              value={stringValue(
                value
              )}
              onChange={(event) =>
                updateMetadata(
                  field.id,
                  event.target.value
                )
              }
              required={
                field.required
              }
              className="
                w-full
                border-b
                border-neutral-200
                bg-transparent
                pb-2
                text-lg
                text-neutral-700
                outline-none
              "
            >
              <option value="">
                {field.placeholder ??
                  "Select an option"}
              </option>

              {field.options?.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}

              {field.id ===
                "category" &&
                !field.options &&
                categories.map(
                  (category) => (
                    <option
                      key={
                        category.id
                      }
                      value={
                        category.slug
                      }
                    >
                      {
                        category.name
                      }
                    </option>
                  )
                )}
            </select>
          </div>
        );

      case "image": {
        const imageValue =
          stringValue(value);

        const isUploading =
          uploadingImageFieldId ===
          field.id;

        return (
          <div
            key={field.id}
            className="mt-8 space-y-3"
          >
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-neutral-500"
            >
              {field.label}

              {field.required && (
                <span className="ml-1 text-neutral-400">
                  *
                </span>
              )}
            </label>

            <input
              id={field.id}
              type="text"
              value={
                imageValue
              }
              onChange={(event) =>
                updateMetadata(
                  field.id,
                  event.target.value
                )
              }
              placeholder={
                field.placeholder ??
                "/images/..."
              }
              required={
                field.required
              }
              className={`${commonClassName} border-b border-neutral-200 pb-2 text-lg text-neutral-700`}
            />

            <div className="flex items-center gap-3">
              <label
                htmlFor={`${field.id}-upload`}
                className="cursor-pointer rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-black"
              >
                {isUploading
                  ? "Uploading..."
                  : "Upload image"}

                <input
                  id={`${field.id}-upload`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  disabled={isUploading}
                  className="sr-only"
                  onChange={(event) => {
                    const file =
                      event.target.files?.[0];

                    event.target.value = "";

                    if (file) {
                      void uploadImage(
                        field,
                        file
                      );
                    }
                  }}
                />
              </label>

              <span className="text-sm text-neutral-400">
                Or paste an existing URL above.
              </span>
            </div>

            {imageUploadError &&
              uploadingImageFieldId ===
                null && (
                <p
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {imageUploadError}
                </p>
              )}

            {imageValue && (
              <div className="overflow-hidden rounded-xl border border-neutral-200">
                <img
                  src={
                    imageValue
                  }
                  alt=""
                  className="max-h-64 w-full object-contain"
                />
              </div>
            )}
          </div>
        );
      }

      case "list": {
        const items =
          parseList(value);

        return (
          <div
            key={field.id}
            className="mt-8 space-y-3"
          >
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-500">
                {field.label}

                {field.required && (
                  <span className="ml-1 text-neutral-400">
                    *
                  </span>
                )}
              </label>

              <button
                type="button"
                onClick={() =>
                  addListItem(
                    field.id
                  )
                }
                className="text-sm font-medium text-neutral-700 hover:text-black"
              >
                + Add
              </button>
            </div>

            {items.map(
              (
                item,
                index
              ) => (
                <div
                  key={`${field.id}-${index}`}
                  className="flex items-center gap-3"
                >
                  <input
                    value={
                      item
                    }
                    onChange={(
                      event
                    ) =>
                      updateListItem(
                        field.id,
                        index,
                        event.target
                          .value
                      )
                    }
                    placeholder={
                      field.placeholder
                    }
                    className={`${commonClassName} border-b border-neutral-200 pb-2 text-lg text-neutral-700`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeListItem(
                        field.id,
                        index
                      )
                    }
                    className="shrink-0 text-sm text-neutral-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )
            )}

            {items.length ===
              0 && (
              <p className="text-sm text-neutral-400">
                Nothing added yet.
              </p>
            )}
          </div>
        );
      }

      case "date":
        return (
          <div
            key={field.id}
            className="mt-8 space-y-2"
          >
            <label className="block text-sm font-medium text-neutral-500">
              {field.label}
            </label>

            <input
              type="date"
              value={stringValue(
                value
              )}
              onChange={(event) =>
                updateMetadata(
                  field.id,
                  event.target.value
                )
              }
              required={
                field.required
              }
              className={`${commonClassName} border-b border-neutral-200 pb-2 text-lg text-neutral-700`}
            />
          </div>
        );

      case "boolean": {
        const checked =
          value === true ||
          value === "true";

        return (
          <label
            key={field.id}
            className="mt-8 flex items-center gap-3 text-sm text-neutral-700"
          >
            <input
              type="checkbox"
              checked={
                checked
              }
              onChange={(event) =>
                updateMetadata(
                  field.id,
                  event.target
                    .checked
                )
              }
            />

            <span>
              {field.label}
            </span>
          </label>
        );
      }

      case "text":
      default:
        return (
          <div
            key={field.id}
            className="mt-8 space-y-2"
          >
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-neutral-500"
            >
              {field.label}

              {field.required && (
                <span className="ml-1 text-neutral-400">
                  *
                </span>
              )}
            </label>

            <input
              id={field.id}
              type="text"
              value={stringValue(
                value
              )}
              onChange={(event) =>
                updateMetadata(
                  field.id,
                  event.target.value
                )
              }
              placeholder={
                field.placeholder
              }
              required={
                field.required
              }
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
      await flushPendingSave();

      setPublishStatus(
        "publishing"
      );

      const publishedDocument:
        Document = {
        ...document,

        metadata: {
          ...metadata,
        },

        blocks: [
          ...blocks,
        ],

        status:
          "published",

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

      const saveResponse = await fetch(
        `/api/documents/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            publishedDocument
          ),
        }
      );

      if (!saveResponse.ok) {
        throw new Error();
      }

      setDocument(
        publishedDocument
      );

      lastSavedFingerprint.current =
        createContentFingerprint(
          publishedDocument.metadata,
          publishedDocument.blocks
        );

      setPublishStatus(
        "published"
      );
    } catch (error) {
      console.error(
        "Failed to publish document:",
        error
      );

      setPublishStatus(
        "error"
      );
    }
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-8 py-24">
          <p className="text-neutral-500">
            {loadError}
          </p>
        </div>
      </main>
    );
  }

  if (
    !document ||
    !schema
  ) {
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

  const actionLabel =
    document.status ===
    "modified"
      ? "Update"
      : "Publish";

  const actionProgressLabel =
    document.status ===
    "modified"
      ? "Updating..."
      : "Publishing...";

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-8 py-12">
        <div className="flex items-center justify-between">
          <Link
            href={`/content/${document.contentTypeId}`}
            className="text-sm text-neutral-500 transition hover:text-black"
          >
            ←{" "}
            {schema.name}
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "failed"
                ? "Save failed"
                : "Saved"}
            </span>
            {saveStatus === "failed" && saveError && (
              <span className="text-sm text-red-500 flex items-center gap-2">
                {saveError}
                <button
                  onClick={() => {
                    setSaveError(null);
                    setSaveStatus("saving");
                  }}
                  className="text-xs underline hover:text-red-700"
                >
                  Retry
                </button>
              </span>
            )}

            {(
              document.status ===
                "draft" ||
              document.status ===
                "modified"
            ) && (
              <button
                onClick={
                  handlePublish
                }
                disabled={
                  publishStatus ===
                    "publishing" ||
                  uploadingImageFieldId !==
                    null
                }
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {publishStatus ===
                "publishing"
                  ? actionProgressLabel
                  : actionLabel}
              </button>
            )}

            {document.status ===
              "published" && (
              <span className="rounded-xl bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-700">
                {publishStatus ===
                "error"
                  ? "Publish failed"
                  : "Published"}
              </span>
            )}

            {publishStatus ===
              "error" &&
              (
                document.status ===
                  "draft" ||
                document.status ===
                  "modified"
              ) && (
                <span className="text-sm text-red-500">
                  {document.status ===
                  "modified"
                    ? "Update failed"
                    : "Publish failed"}
                </span>
              )}
          </div>
        </div>

        <div className="mt-16">
          {schema.metadata.map(
            renderMetadataField
          )}

          {schema.allowedBlocks
            .length > 0 && (
            <BlockEditor
              blocks={blocks}
              allowedBlocks={
                schema.allowedBlocks
              }
              onChange={
                setBlocks
              }
            />
          )}
        </div>
      </div>
    </main>
  );
}