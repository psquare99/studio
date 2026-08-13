import { ContentType } from "@/lib/models/content-type";

const contentTypes: ContentType[] = [
  {
    id: "journal",
    workspaceId: "the-long-way-home",
    name: "Journal",
    description: "Write something for The Long Way Home",
    icon: "📝",
    schemaId: "journal",
  },
  {
    id: "project",
    workspaceId: "the-long-way-home",
    name: "Project",
    description: "Document something you're building",
    icon: "🚀",
    schemaId: "project",
  },
];

export function getContentTypes(workspaceId: string): ContentType[] {
  return contentTypes.filter(
    (type) => type.workspaceId === workspaceId
  );
}