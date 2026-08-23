"use client";

import { useState } from "react";

import type { DocumentBlock } from "@/lib/models/document";

interface BlockEditorProps {
  blocks: DocumentBlock[];
  onChange: (blocks: DocumentBlock[]) => void;
  allowedBlocks: string[];
}

const blockLabels: Record<string, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  quote: "Quote",
  image: "Image",
  code: "Code",
  gallery: "Gallery",
};

function createBlock(type: string): DocumentBlock {
  switch (type) {
    case "paragraph":
      return {
        id: crypto.randomUUID(),
        type: "paragraph",
        data: {
          text: "",
        },
      };

    case "heading":
      return {
        id: crypto.randomUUID(),
        type: "heading",
        data: {
          text: "",
          level: 2,
        },
      };

    case "quote":
      return {
        id: crypto.randomUUID(),
        type: "quote",
        data: {
          text: "",
        },
      };

    case "image":
      return {
        id: crypto.randomUUID(),
        type: "image",
        data: {
          src: "",
          alt: "",
        },
      };

    case "code":
      return {
        id: crypto.randomUUID(),
        type: "code",
        data: {
          code: "",
        },
      };

    case "gallery":
      return {
        id: crypto.randomUUID(),
        type: "gallery",
        data: {
          images: [],
        },
      };

    default:
      return {
        id: crypto.randomUUID(),
        type,
        data: {},
      };
  }
}

export default function BlockEditor({
  blocks,
  onChange,
  allowedBlocks,
}: BlockEditorProps) {
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<{ blockId: string; message: string } | null>(null);
  function updateBlock(
    blockId: string,
    data: unknown
  ) {
    onChange(
      blocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              data,
            }
          : block
      )
    );
  }

  function addBlock(type: string) {
    if (!allowedBlocks.includes(type)) {
      return;
    }

    onChange([
      ...blocks,
      createBlock(type),
    ]);
  }

  function deleteBlock(blockId: string) {
    onChange(
      blocks.filter(
        (block) => block.id !== blockId
      )
    );
  }

  return (
    <div className="mt-12 space-y-8">
      {blocks.map((block) => {
        /*
         * PARAGRAPH
         */
        if (block.type === "paragraph") {
          const data = block.data as {
            text?: string;
          };

          return (
            <div
              key={block.id}
              className="group relative"
            >
              <textarea
                value={data.text ?? ""}
                onChange={(event) =>
                  updateBlock(
                    block.id,
                    {
                      text: event.target.value,
                    }
                  )
                }
                placeholder="Write something..."
                className="min-h-[120px] w-full resize-none border-none text-lg leading-8 text-neutral-700 outline-none placeholder:text-neutral-300"
              />

              <button
                type="button"
                onClick={() =>
                  deleteBlock(block.id)
                }
                className="absolute -right-20 top-2 text-xs text-neutral-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          );
        }

        /*
         * HEADING
         */
        if (block.type === "heading") {
          const data = block.data as {
            text?: string;
            level?: number;
          };

          return (
            <div
              key={block.id}
              className="group relative"
            >
              <input
                value={data.text ?? ""}
                onChange={(event) =>
                  updateBlock(
                    block.id,
                    {
                      text: event.target.value,
                      level:
                        data.level ?? 2,
                    }
                  )
                }
                placeholder="Heading..."
                className="w-full border-none text-3xl font-semibold tracking-tight text-neutral-800 outline-none placeholder:text-neutral-300"
              />

              <button
                type="button"
                onClick={() =>
                  deleteBlock(block.id)
                }
                className="absolute -right-20 top-2 text-xs text-neutral-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          );
        }

        /*
         * QUOTE
         */
        if (block.type === "quote") {
          const data = block.data as {
            text?: string;
          };

          return (
            <div
              key={block.id}
              className="group relative border-l-4 border-neutral-200 pl-6"
            >
              <textarea
                value={data.text ?? ""}
                onChange={(event) =>
                  updateBlock(
                    block.id,
                    {
                      text: event.target.value,
                    }
                  )
                }
                placeholder="Write a quote..."
                className="min-h-[100px] w-full resize-none border-none bg-transparent text-xl italic leading-8 text-neutral-600 outline-none placeholder:text-neutral-300"
              />

              <button
                type="button"
                onClick={() =>
                  deleteBlock(block.id)
                }
                className="absolute -right-20 top-2 text-xs text-neutral-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          );
        }

        /*
         * IMAGE
         */
        if (block.type === "image") {
          const data = block.data as {
            src?: string;
            alt?: string;
          };

          return (
            <div
              key={block.id}
              className="group relative space-y-4 rounded-xl border border-neutral-200 p-5"
            >
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
                Image
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 transition hover:border-neutral-400 hover:text-black">
                  {uploadingBlockId === block.id ? "Uploading..." : "Upload image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    className="sr-only"
                    disabled={uploadingBlockId === block.id}
                    onChange={async (event) => {
                      const file = event.target.files?.[0];

                      if (!file) {
                        return;
                      }

                      setUploadError(null);
                      setUploadingBlockId(block.id);

                      try {
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("alt", data.alt ?? "");

                        const response = await fetch("/api/media/upload", {
                          method: "POST",
                          body: formData,
                        });

                        const responseText = await response.text();

let result: {
  asset?: {
    url: string;
    alt: string;
  };
  error?: string;
};

try {
  result = JSON.parse(responseText);
} catch {
  throw new Error(
    `Upload API returned non-JSON (${response.status}): ${responseText.slice(0, 300)}`
  );
}

                        if (!response.ok || !result.asset) {
                          throw new Error(result.error ?? "Failed to upload image.");
                        }

                        updateBlock(block.id, {
                          src: result.asset.url,
                          alt: result.asset.alt,
                        });
                      } catch (error) {
                        setUploadError({
                          blockId: block.id,
                          message:
                            error instanceof Error
                              ? error.message
                              : "Failed to upload image.",
                        });
                      } finally {
                        setUploadingBlockId(null);
                        event.target.value = "";
                      }
                    }}
                  />
                </label>

                <span className="text-xs text-neutral-300">or</span>

                <input
                  type="text"
                  value={data.src ?? ""}
                  onChange={(event) =>
                    updateBlock(
                      block.id,
                      {
                        src: event.target.value,
                        alt: data.alt ?? "",
                      }
                    )
                  }
                  placeholder="Paste image URL"
                  className="min-w-[240px] flex-1 rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <input
                type="text"
                value={data.alt ?? ""}
                onChange={(event) =>
                  updateBlock(
                    block.id,
                    {
                      src: data.src ?? "",
                      alt: event.target.value,
                    }
                  )
                }
                placeholder="Alt text"
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400"
              />

              {uploadError?.blockId === block.id && (
                <p className="text-sm text-red-500">{uploadError.message}</p>
              )}

              {data.src && (
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                  <img
                    src={data.src}
                    alt={data.alt ?? ""}
                    className="max-h-[500px] w-full object-contain"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  deleteBlock(block.id)
                }
                className="absolute right-4 top-4 text-xs text-neutral-400 transition hover:text-red-500"
              >
                Delete
              </button>
            </div>
          );
        }

        /*
         * UNSUPPORTED BLOCK
         */
        return (
          <div
            key={block.id}
            className="group relative rounded-xl border border-dashed border-neutral-200 p-6"
          >
            <div className="text-sm text-neutral-400">
              {blockLabels[block.type] ??
                block.type}
            </div>

            <div className="mt-2 text-xs text-neutral-300">
              This block type is not yet
              supported by the editor.
            </div>

            <button
              type="button"
              onClick={() =>
                deleteBlock(block.id)
              }
              className="absolute right-4 top-4 text-xs text-neutral-400 transition hover:text-red-500"
            >
              Delete
            </button>
          </div>
        );
      })}

      <div className="pt-2">
        <div className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
          Add block
        </div>

        <div className="flex flex-wrap gap-3">
          {allowedBlocks.map(
            (blockType) => (
              <button
                key={blockType}
                type="button"
                onClick={() =>
                  addBlock(blockType)
                }
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-500 transition hover:border-neutral-400 hover:text-black"
              >
                +{" "}
                {blockLabels[blockType] ??
                  blockType}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}