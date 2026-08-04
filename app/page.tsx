import Link from "next/link";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto flex h-screen max-w-5xl flex-col px-8 py-12">
        <h1 className="text-4xl font-bold">P² Studio</h1>

        <p className="mt-2 text-neutral-500">
          What's on your mind today?
        </p>
<div className="mt-12 flex gap-4">
  <Link
    href="/editor"
    className="rounded-xl bg-black px-6 py-3 text-white transition hover:bg-neutral-800"
  >
    New Journal
  </Link>

  <button className="rounded-xl border px-6 py-3 transition hover:bg-neutral-100">
    New Project
  </button>
</div>
      </div>
    </main>
  );
}