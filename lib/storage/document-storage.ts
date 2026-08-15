import type { Document } from "@/lib/models/document";

import { supabase } from "@/lib/supabase";

function fromDatabaseRow(
  row: {
    id: string;
    workspace_id: string;
    content_type_id: string;
    metadata: unknown;
    blocks: unknown;
    status: string;
    updated_at: string;
    published_at: string | null;
  }
): Document {
  return {
    id: row.id,

    workspaceId:
      row.workspace_id,

    contentTypeId:
      row.content_type_id,

    metadata:
      (row.metadata as Document["metadata"]) ??
      {},

    blocks:
      (row.blocks as Document["blocks"]) ??
      [],

    status:
      row.status as Document["status"],

    updatedAt:
      row.updated_at,

    ...(row.published_at
      ? {
          publishedAt:
            row.published_at,
        }
      : {}),
  };
}

function toDatabaseRow(
  document: Document
) {
  return {
    id: document.id,

    workspace_id:
      document.workspaceId,

    content_type_id:
      document.contentTypeId,

    metadata:
      document.metadata,

    blocks:
      document.blocks,

    status:
      document.status,

    updated_at:
      document.updatedAt,

    published_at:
      document.publishedAt ??
      null,
  };
}

export async function getDocuments(): Promise<Document[]> {
  const { data, error } =
    await supabase
      .from("documents")
      .select("*")
      .order("updated_at", {
        ascending: false,
      });

  if (error) {
    throw new Error(
      `Failed to load documents: ${error.message}`
    );
  }

  return (data ?? []).map(
    fromDatabaseRow
  );
}

export async function saveDocuments(
  documents: Document[]
): Promise<void> {
  if (documents.length === 0) {
    return;
  }

  const rows =
    documents.map(toDatabaseRow);

  const { error } =
    await supabase
      .from("documents")
      .upsert(rows);

  if (error) {
    throw new Error(
      `Failed to save documents: ${error.message}`
    );
  }
}

export async function createDocument(
  workspaceId: string,
  contentTypeId: string
): Promise<Document> {
  const document: Document = {
    id: crypto.randomUUID(),

    workspaceId,

    contentTypeId,

    metadata: {},

    blocks: [],

    status: "draft",

    updatedAt:
      new Date().toISOString(),
  };

  const { data, error } =
    await supabase
      .from("documents")
      .insert(
        toDatabaseRow(document)
      )
      .select()
      .single();

  if (error) {
    throw new Error(
      `Failed to create document: ${error.message}`
    );
  }

  return fromDatabaseRow(data);
}

export async function getDocument(
  id: string
): Promise<Document | undefined> {
  const { data, error } =
    await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load document: ${error.message}`
    );
  }

  if (!data) {
    return undefined;
  }

  return fromDatabaseRow(data);
}

export async function updateDocument(
  updated: Document
): Promise<void> {
  const { error } =
    await supabase
      .from("documents")
      .update(
        toDatabaseRow(updated)
      )
      .eq("id", updated.id);

  if (error) {
    throw new Error(
      `Failed to update document: ${error.message}`
    );
  }
}

export async function deleteDocument(
  id: string
): Promise<void> {
  const { error } =
    await supabase
      .from("documents")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(
      `Failed to delete document: ${error.message}`
    );
  }
}

export async function getRecentDocuments(): Promise<Document[]> {
  return getDocuments();
}