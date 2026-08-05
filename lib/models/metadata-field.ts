export interface MetadataField {
  id: string;

  label: string;

  type: "text" | "number" | "date" | "boolean";

  required: boolean;

  placeholder?: string;
}