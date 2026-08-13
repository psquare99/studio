import Link from "next/link";

import { ContentType } from "@/lib/models/content-type";

interface Props {
  workspaceId: string;
  contentType: ContentType;
}

export default function ContentTypeCard({
  workspaceId,
  contentType,
}: Props) {
  return (
    <Link
      href={`/content/${contentType.id}`}
      className="block rounded-2xl border border-neutral-200 p-6 text-left transition hover:border-black"
    >
      <div className="text-3xl">
        {contentType.icon}
      </div>

      <h3 className="mt-4 text-xl font-semibold">
        {contentType.name}
      </h3>

      <p className="mt-2 text-neutral-500">
        {contentType.description}
      </p>
    </Link>
  );
}