import { Document } from "@/lib/models/document";

const STORAGE_KEY = "studio-documents";

export function getDocuments(): Document[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  const documents = JSON.parse(data) as Document[];

  return documents.map((document) => ({
    ...document,
    status: document.status ?? "draft",
  }));
}

export function saveDocuments(documents: Document[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(documents)
  );
}

export function createDocument(
  workspaceId: string,
  contentTypeId: string
): Document {
  const documents = getDocuments();

  const document: Document = {
    id: crypto.randomUUID(),

    workspaceId,

    contentTypeId,

    metadata: {},

    blocks: [],

    status: "draft",

    updatedAt: new Date().toISOString(),
  };

  documents.unshift(document);

  saveDocuments(documents);

  return document;
}

export function getDocument(
  id: string
): Document | undefined {
  return getDocuments().find(
    (document) => document.id === id
  );
}

export function updateDocument(
  updated: Document
) {
  const documents = getDocuments().map((document) =>
    document.id === updated.id
      ? updated
      : document
  );

  saveDocuments(documents);
}

export function getRecentDocuments(): Document[] {
  return getDocuments().sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime()
  );
}
export function deleteDocument(
  id: string
): void {
  const documents =
    getDocuments().filter(
      (document) =>
        document.id !== id
    );

  saveDocuments(
    documents
  );
}