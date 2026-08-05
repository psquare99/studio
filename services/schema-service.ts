import { loadContentTypes } from "./content-type-service";
import { getSchema } from "@/lib/storage/schema-storage";

export function loadSchemaForContentType(
  workspaceId: string,
  contentTypeId: string
) {
  const contentType = loadContentTypes(workspaceId).find(
    (type) => type.id === contentTypeId
  );

  if (!contentType) {
    return undefined;
  }

  return getSchema(contentType.schemaId);
}