import Link from "next/link";

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
  const { workspaceId } =
    await params;

  const contentTypes =
    loadContentTypes(
      workspaceId
    );

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-8 py-16">
        <div className="flex items-start justify-between gap-8">
          <div>
            <h1 className="text-5xl font-bold capitalize">
              {workspaceId}
            </h1>

            <p className="mt-3 text-lg text-neutral-500">
              What would you like to create?
            </p>
          </div>

          <Link
            href="/categories"
            className="
              rounded-xl
              border
              border-neutral-200
              bg-white
              px-5
              py-3
              text-sm
              font-medium
              text-neutral-700
              transition
              hover:border-neutral-900
              hover:text-black
            "
          >
            Categories
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {contentTypes.map(
            (contentType) => (
              <ContentTypeCard
                key={
                  contentType.id
                }
                workspaceId={
                  workspaceId
                }
                contentType={
                  contentType
                }
              />
            )
          )}
        </div>
      </div>
    </main>
  );
}