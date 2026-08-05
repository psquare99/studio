import { DocumentModel } from "@/lib/models/document";

const STORAGE_KEY = "studio-documents";

export function getDocuments(): DocumentModel[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export function saveDocuments(documents: DocumentModel[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

export function createDocument(): DocumentModel {
  const documents = getDocuments();

  const document: DocumentModel = {
    id: crypto.randomUUID(),
    title: "",
    content: "",
    updatedAt: new Date().toISOString(),
  };

  documents.unshift(document);

  saveDocuments(documents);

  return document;
}

export function getDocument(id: string) {
  return getDocuments().find((document) => document.id === id);
}

export function updateDocument(updated: DocumentModel) {
  const documents = getDocuments().map((document) =>
    document.id === updated.id ? updated : document
  );

  saveDocuments(documents);
}
export function getRecentDocuments(): DocumentModel[] {
  return getDocuments().sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime()
  );
}