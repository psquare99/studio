import DraftCard from "./DraftCard";
import { Document } from "@/lib/models/document";

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
}

export default function DocumentList({
  documents,
  onDelete,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 p-10 text-neutral-500">
        No documents yet.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {documents.map((document) => (
        <DraftCard
          key={document.id}
          id={document.id}
          title={
  typeof document.metadata.title === "string"
    ? document.metadata.title
    : "Untitled"
}
          excerpt={
  typeof document.metadata.excerpt === "string"
    ? document.metadata.excerpt
    : undefined
}
          updatedAt={
            document.updatedAt
          }
          status={
            document.status
          }
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}