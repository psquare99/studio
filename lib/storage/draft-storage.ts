import { DocumentModel } from "@/lib/models/document";

const STORAGE_KEY = "studio-current-draft";

export function saveDraft(document: DocumentModel) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
}

export function loadDraft(): DocumentModel | null {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return null;

  return JSON.parse(data);
}