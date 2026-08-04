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