import { DocumentModel } from "@/lib/models/document";
import {
  createDocument,
  getDocument,
  getRecentDocuments,
  updateDocument,
} from "@/lib/storage/document-storage";

export function createNewDocument(): DocumentModel {
  return createDocument();
}

export function loadDocument(id: string): DocumentModel | undefined {
  return getDocument(id);
}

export function saveDocument(document: DocumentModel): void {
  updateDocument(document);
}

export function loadRecentDocuments(): DocumentModel[] {
  return getRecentDocuments();
}