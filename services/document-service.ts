import { Document } from "@/lib/models/document";

import {
  createDocument,
  getDocument,
  getRecentDocuments,
  updateDocument,
  deleteDocument,
} from "@/lib/storage/document-storage";

import { loadSchemaForContentType } from "./schema-service";

import { EditorDocument } from "@/services/types/editor-document";

export function createNewDocument(
  workspaceId: string,
  contentTypeId: string
): Document {
  return createDocument(
    workspaceId,
    contentTypeId
  );
}

export function loadDocument(
  id: string
): Document | undefined {
  return getDocument(id);
}

export function loadEditorDocument(
  id: string
): EditorDocument | undefined {
  const document = getDocument(id);

  if (!document) {
    return undefined;
  }

  const schema = loadSchemaForContentType(
    document.workspaceId,
    document.contentTypeId
  );

  if (!schema) {
    return undefined;
  }

  return {
    document,
    schema,
  };
}

export function saveDocument(
  document: Document
): void {
  updateDocument(document);
}

export function removeDocument(
  id: string
): void {
  deleteDocument(id);
}

export function loadRecentDocuments(): Document[] {
  return getRecentDocuments();
}