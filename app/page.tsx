import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-8 py-16">

        <header>
          <h1 className="text-5xl font-bold tracking-tight">
            P² Studio
          </h1>

          <p className="mt-3 text-lg text-neutral-500">
            What's on your mind today?
          </p>
        </header>

        <section className="mt-16 flex gap-4">

          <Link
            href="/editor"
            className="rounded-2xl bg-black px-8 py-4 text-white transition hover:bg-neutral-800"
          >
            New Journal
          </Link>

          <button className="rounded-2xl border border-neutral-300 px-8 py-4 transition hover:bg-neutral-100">
            New Project
          </button>

        </section>

        <section className="mt-20 border-t pt-10">

          <h2 className="text-lg font-semibold">
            Continue Writing
          </h2>

          <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 p-10 text-neutral-500">
            No drafts yet.
          </div>

        </section>

        <section className="mt-16 border-t pt-10">

          <h2 className="text-lg font-semibold">
            Recently Published
          </h2>

          <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 p-10 text-neutral-500">
            Nothing published yet.
          </div>

        </section>

      </div>
    </main>
  );
}