import { getContentTypes } from "@/lib/storage/content-type-storage";

export function loadContentTypes(workspaceId: string) {
  return getContentTypes(workspaceId);
}