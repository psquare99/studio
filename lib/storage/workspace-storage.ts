import { Workspace } from "@/lib/models/workspace";

const workspaces: Workspace[] = [
  {
    id: "psquare",
    name: "psquare.dev",
    description: "Personal website and publishing",
    color: "#111827",
  },
  {
    id: "adikailash",
    name: "Adi Kailash Tourism",
    description: "Tours, destinations and travel content",
    color: "#0F766E",
  },
];

export function getWorkspaces(): Workspace[] {
  return workspaces;
}

export function getWorkspace(id: string): Workspace | undefined {
  return workspaces.find((workspace) => workspace.id === id);
}