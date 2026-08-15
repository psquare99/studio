import { Document } from "@/lib/models/document";

import {
  createDocument,
  getDocument,
  getRecentDocuments,
  updateDocument,
  deleteDocument,
} from "@/lib/storage/document-storage";

import { loadSchemaForContentType } from "./schema-service";

import type { EditorDocument } from "@/services/types/editor-document";

export async function createNewDocument(
  workspaceId: string,
  contentTypeId: string
): Promise<Document> {
  return createDocument(
    workspaceId,
    contentTypeId
  );
}

export async function loadDocument(
  id: string
): Promise<Document | undefined> {
  return getDocument(id);
}

export async function loadEditorDocument(
  id: string
): Promise<EditorDocument | undefined> {
  const document = await getDocument(id);

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

export async function saveDocument(
  document: Document
): Promise<void> {
  await updateDocument(document);
}

export async function removeDocument(
  id: string
): Promise<void> {
  await deleteDocument(id);
}

export async function loadRecentDocuments(): Promise<Document[]> {
  return getRecentDocuments();
}