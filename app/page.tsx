import Link from "next/link";

import { loadContentTypes } from "@/services/content-type-service";
import ContentTypeCard from "@/components/workspace/ContentTypeCard";

const WORKSPACE_ID = "the-long-way-home";

function WorkshopMark() {
  return (
    <div
      aria-hidden="true"
      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm"
    >
      <svg
        viewBox="0 0 64 64"
        className="h-9 w-9 text-neutral-900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 47.5V25.5L32 13L52 25.5V47.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M20 47.5V31H44V47.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M27 47.5V38H37V47.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M8 52H56"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function HomePage() {
  const contentTypes = loadContentTypes(WORKSPACE_ID);

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14 lg:px-10">
        {/* Header */}
        <header className="flex items-start justify-between gap-8">
          <div className="flex items-start gap-4">
            <WorkshopMark />

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
                Workshop
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                The Long Way Home
              </h1>

              <p className="mt-2 max-w-xl text-base text-neutral-500 sm:text-lg">
                A quiet place for things worth making.
              </p>
            </div>
          </div>

          <Link
            href="/categories"
            className="
              shrink-0
              rounded-xl
              border
              border-neutral-200
              bg-white
              px-5
              py-3
              text-sm
              font-medium
              text-neutral-700
              shadow-sm
              transition
              hover:border-neutral-300
              hover:text-black
              hover:shadow
            "
          >
            Categories
          </Link>
        </header>

        {/* Divider */}
        <div className="mt-14 border-t border-neutral-200" />

        {/* Creation area */}
        <section className="mt-10">
          <div>
            <p className="text-sm font-medium text-neutral-400">
              Create
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              What are you working on?
            </h2>

            <p className="mt-2 text-neutral-500">
              Choose a kind of thing to create.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {contentTypes.map((contentType) => (
              <ContentTypeCard
                key={contentType.id}
                workspaceId={WORKSPACE_ID}
                contentType={contentType}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-neutral-200 pt-6">
          <div className="flex flex-col gap-2 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
            <span>The Long Way Home Workshop</span>

            <span>Make things. Keep going.</span>
          </div>
        </footer>
      </div>
    </main>
  );
}