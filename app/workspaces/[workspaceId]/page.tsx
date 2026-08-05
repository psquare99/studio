import { loadContentTypes } from "@/services/content-type-service";
import ContentTypeCard from "@/components/workspace/ContentTypeCard";

interface Props {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspacePage({
  params,
}: Props) {
  const { workspaceId } = await params;

  const contentTypes = loadContentTypes(workspaceId);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-8 py-16">

        <h1 className="text-5xl font-bold capitalize">
          {workspaceId}
        </h1>

        <p className="mt-3 text-lg text-neutral-500">
          What would you like to create?
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {contentTypes.map((contentType) => (
            <ContentTypeCard
  key={contentType.id}
  workspaceId={workspaceId}
  contentType={contentType}
/>
          ))}
        </div>

      </div>
    </main>
  );
}