import { Workspace } from "@/lib/models/workspace";

const workspaces: Workspace[] = [
  {
    id: "the-long-way-home",
    name: "The Long Way Home",
    description: "Personal website and publishing",
    color: "#111827",
  },
];

export function getWorkspaces(): Workspace[] {
  return workspaces;
}

export function getWorkspace(id: string): Workspace | undefined {
  return workspaces.find((workspace) => workspace.id === id);
}