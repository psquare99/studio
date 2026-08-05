import { MetadataField } from "@/lib/models/metadata-field";

interface Props {
  fields: MetadataField[];
}

export default function MetadataFields({
  fields,
}: Props) {
  return (
    <div className="space-y-8">
      {fields.map((field) => (
        <input
          key={field.id}
          placeholder={field.label}
          className="w-full border-none text-6xl font-bold outline-none placeholder:text-neutral-400"
        />
      ))}
    </div>
  );
}