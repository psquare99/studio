export interface MetadataField {
  id: string;

  label: string;

  type:
    | "text"
    | "number"
    | "date"
    | "boolean"
    | "select";

  required: boolean;

  placeholder?: string;

  options?: {
    value: string;
    label: string;
  }[];
}