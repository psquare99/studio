"use client";

import type { DocumentBlock } from "@/lib/models/document";

interface BlockEditorProps {
  blocks: DocumentBlock[];
  onChange: (blocks: DocumentBlock[]) => void;
  allowedBlocks: string[];
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

  function addParagraph() {
    if (!allowedBlocks.includes("paragraph")) {
      return;
    }

    onChange([
      ...blocks,
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        data: {
          text: "",
        },
      },
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
    <div className="mt-12 space-y-6">
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
            className="rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-400"
          >
            Unsupported block:{" "}
            {block.type}
          </div>
        );
      })}

      {allowedBlocks.includes(
        "paragraph"
      ) && (
        <button
          type="button"
          onClick={addParagraph}
          className="text-sm text-neutral-400 transition hover:text-black"
        >
          + Add paragraph
        </button>
      )}
    </div>
  );
}