import { ContentType } from "@/lib/models/content-type";

const contentTypes: ContentType[] = [
  {
    id: "journal",
    workspaceId: "psquare",
    name: "Journal",
    description: "Personal thoughts and reflections",
    icon: "📝",
    schemaId: "journal",
  },
  {
    id: "project",
    workspaceId: "psquare",
    name: "Project",
    description: "Projects you're building",
    icon: "🚀",
    schemaId: "project",
  },
  {
    id: "tour",
    workspaceId: "adikailash",
    name: "Tour Package",
    description: "Create a new tour package",
    icon: "🏔",
    schemaId: "tour",
  },
  {
    id: "destination",
    workspaceId: "adikailash",
    name: "Destination",
    description: "Create a destination page",
    icon: "📍",
    schemaId: "destination",
  },
];
export function getContentTypes(workspaceId: string) {
  return contentTypes.filter(
    (type) => type.workspaceId === workspaceId
  );

  schemaId: "journal"
  schemaId: "project"
}