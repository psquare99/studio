"use client";

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
              This block type will be
              supported by the editor next.
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