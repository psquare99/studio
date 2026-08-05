import Link from "next/link";

import { Workspace } from "@/lib/models/workspace";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export default function WorkspaceCard({
  workspace,
}: WorkspaceCardProps) {
  return (
    <Link
      href={`/workspaces/${workspace.id}`}
      className="block rounded-2xl border border-neutral-200 p-6 transition hover:border-black hover:shadow-sm"
    >
      <h3 className="text-2xl font-semibold">
        {workspace.name}
      </h3>

      <p className="mt-3 text-neutral-500">
        {workspace.description}
      </p>
    </Link>
  );
}