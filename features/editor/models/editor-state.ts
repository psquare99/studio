import { Document } from "@/lib/models/document";
import { Schema } from "@/lib/models/schema";

export interface EditorState {
  document: Document;

  schema: Schema;
}