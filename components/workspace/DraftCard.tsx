import Link from "next/link";

interface DraftCardProps {
  id: string;
  title: string;
  excerpt?: string;
  updatedAt: string;
}

export default function DraftCard({
  id,
  title,
  excerpt,
  updatedAt,
}: DraftCardProps) {
  const date = new Date(updatedAt);

  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/documents/${id}`}
      className="block rounded-2xl border border-neutral-200 p-6 transition hover:border-black hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xl font-semibold">
            {title}
          </p>

          {excerpt && (
            <p className="mt-2 text-neutral-500">
              {excerpt}
            </p>
          )}
        </div>

        <span className="shrink-0 text-sm text-neutral-400">
          {formattedDate}
        </span>
      </div>
    </Link>
  );
}