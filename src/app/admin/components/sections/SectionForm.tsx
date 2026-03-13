"use client";

import { FieldEditor } from "@/app/admin/components/fields";
import type { FieldConfig, SectionRecord } from "@/lib/admin/types";

type SectionFormProps = {
  fields: FieldConfig[];
  data: SectionRecord;
  onChange: (next: SectionRecord) => void;
};

export function SectionForm({ fields, data, onChange }: SectionFormProps) {
  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">{field.label}</label>
            {field.description ? <p className="text-xs text-zinc-500">{field.description}</p> : null}
          </div>
          <FieldEditor
            field={field}
            value={data[field.key]}
            onChange={(nextValue) => onChange({ ...data, [field.key]: nextValue })}
          />
        </div>
      ))}
    </div>
  );
}
