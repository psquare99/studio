import { Document } from "@/lib/models/document";

const STORAGE_KEY = "studio-current-draft";

export function saveDraft(document: Document) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
}

export function loadDraft(): Document | null {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return null;

  return JSON.parse(data);
}