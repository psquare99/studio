import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import { loadWorkspaces } from "@/services/workspace-service";

export default function WorkspacesPage() {
  const workspaces = loadWorkspaces();

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-8 py-16">
        <h1 className="text-5xl font-bold">
          Choose Workspace
        </h1>

        <p className="mt-3 text-lg text-neutral-500">
          Where do you want to create today?
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
            />
          ))}
        </div>
      </div>
    </main>
  );
}