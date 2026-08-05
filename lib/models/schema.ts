import { MetadataField } from "./metadata-field";

export interface Schema {
  id: string;

  name: string;

  description: string;

  metadata: MetadataField[];

  allowedBlocks: string[];
}