import Link from "next/link";

export default function EditorPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl-12">

        <Link
          href="/"
          className="mb-12 inline-block text-sm text-neutral-500 transition hover:text-black"
        >
          ← Workspace
        </Link>

        <input
          placeholder="Untitled"
          className="mt-8 w-full border-none text-7xl font-bold outline-none placeholder:text-neutral-400"
        />

        <textarea
          placeholder="Start writing..."
          className="mt-10 min-h-[600px] w-full resize-none border-none text-xl leading-8 outline-none placeholder:text-neutral-400"
        />
      </div>
    </main>
  );
}