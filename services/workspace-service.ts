import {
  getWorkspace,
  getWorkspaces,
} from "@/lib/storage/workspace-storage";

export function loadWorkspaces() {
  return getWorkspaces();
}

export function loadWorkspace(id: string) {
  return getWorkspace(id);
}