import { Document } from "@/lib/models/document";
import { Schema } from "@/lib/models/schema";

export interface EditorDocument {
  document: Document;
  schema: Schema;
}