import { loadContentTypes } from "@/services/content-type-service";
import ContentTypeCard from "@/components/workspace/ContentTypeCard";

const WORKSPACE_ID = "the-long-way-home";

export default function HomePage() {
  const contentTypes = loadContentTypes(WORKSPACE_ID);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-8 py-16">
        <h1 className="text-5xl font-bold">
          The Long Way Home
        </h1>

        <p className="mt-3 text-lg text-neutral-500">
          What would you like to create?
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {contentTypes.map((contentType) => (
            <ContentTypeCard
              key={contentType.id}
              workspaceId={WORKSPACE_ID}
              contentType={contentType}
            />
          ))}
        </div>
      </div>
    </main>
  );
}