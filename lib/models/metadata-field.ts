export interface MetadataField {
  id: string;

  label: string;

  type:
    | "text"
    | "date"
    | "boolean"
    | "select"
    | "image"
    | "list";

  required: boolean;

  placeholder?: string;

  options?: {
    value: string;
    label: string;
  }[];
}