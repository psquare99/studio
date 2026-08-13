"use client";

import { useRouter } from "next/navigation";
import { createNewDocument } from "@/services/document-service";

export default function NewJournalButton() {
  const router = useRouter();

  function handleClick() {
    const document = createNewDocument(
  "the-long-way-home",
  "journal"
);

router.push(`/documents/${document.id}`);
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-2xl bg-black px-8 py-4 text-white transition hover:bg-neutral-800"
    >
      New Journal
    </button>
  );
}