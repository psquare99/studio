import Link from "next/link";

interface DraftCardProps {
  id: string;
  title: string;
}

export default function DraftCard({
  id,
  title,
}: DraftCardProps) {
  return (
    <Link
      href={`/documents/${id}`}
      className="block rounded-2xl border border-neutral-200 p-6 transition hover:border-black"
    >
      <p className="text-xl font-semibold">
        {title}
      </p>

      <p className="mt-2 text-sm text-neutral-500">
        Continue writing...
      </p>
    </Link>
  );
}