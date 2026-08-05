import { Document } from "@/lib/models/document";

const STORAGE_KEY = "studio-documents";

export function getDocuments(): Document[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export function saveDocuments(documents: Document[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
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

  updatedAt: new Date().toISOString(),
};

  documents.unshift(document);

  saveDocuments(documents);

  return document;
}

export function getDocument(id: string) {
  return getDocuments().find((document) => document.id === id);
}

export function updateDocument(updated: Document) {
  const documents = getDocuments().map((document) =>
    document.id === updated.id ? updated : document
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