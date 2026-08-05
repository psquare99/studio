import DraftCard from "./DraftCard";
import { DocumentModel } from "@/lib/models/document";

interface DocumentListProps {
  documents: DocumentModel[];
}

export default function DocumentList({
  documents,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 p-10 text-neutral-500">
        No drafts yet.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {documents.map((document) => (
        <DraftCard
    key={document.id}
    id={document.id}
    title={document.title || "Untitled"}
/>
      ))}
    </div>
  );
}