"use client";

import { fromTextValue, toTextValue } from "@/lib/admin/converters";
import { Plus, Trash2 } from "lucide-react";
import type { FieldConfig, SocialItem, StatItem } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

import { ImageUploader } from "@/app/admin/components/fields/ImageUploader";

type FieldEditorProps = {
  field: FieldConfig;
  value: unknown;
  onChange: (next: unknown) => void;
};

export function FieldEditor({ field, value, onChange }: FieldEditorProps) {
  const textValue = toTextValue(value, field.type);
  const baseInput =
    "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200";

  if (field.type === "stats") {
    const list = Array.isArray(value) ? (value as StatItem[]) : [];

    const addItem = () => {
      onChange([...list, { value: 0, suffix: "", label: "" }]);
    };

    const updateItem = (index: number, next: StatItem) => {
      onChange(list.map((item, i) => (i === index ? next : item)));
    };

    const removeItem = (index: number) => {
      onChange(list.filter((_, i) => i !== index));
    };

    return (
      <div className="space-y-3">
        {list.map((item, index) => (
          <div key={`${field.key}-${index}`} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[120px_100px_1fr_auto]">
              <input
                type="number"
                value={String(item.value ?? 0)}
                onChange={(event) =>
                  updateItem(index, {
                    ...item,
                    value: Number(event.target.value) || 0,
                  })
                }
                placeholder="Value"
                className={baseInput}
              />
              <input
                type="text"
                value={item.suffix ?? ""}
                onChange={(event) => updateItem(index, { ...item, suffix: event.target.value })}
                placeholder="Suffix"
                className={baseInput}
              />
              <input
                type="text"
                value={item.label ?? ""}
                onChange={(event) => updateItem(index, { ...item, label: event.target.value })}
                placeholder="Label"
                className={baseInput}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-2.5 text-zinc-500 hover:bg-zinc-100"
                aria-label="Remove stat"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <Plus size={14} />
          Add Stat
        </button>
      </div>
    );
  }

  if (field.type === "socials") {
    const list = Array.isArray(value) ? (value as SocialItem[]) : [];

    const addItem = () => {
      onChange([...list, { name: "", href: "" }]);
    };

    const updateItem = (index: number, next: SocialItem) => {
      onChange(list.map((item, i) => (i === index ? next : item)));
    };

    const removeItem = (index: number) => {
      onChange(list.filter((_, i) => i !== index));
    };

    return (
      <div className="space-y-3">
        {list.map((item, index) => (
          <div key={`${field.key}-${index}`} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr_auto]">
              <input
                type="text"
                value={item.name ?? ""}
                onChange={(event) => updateItem(index, { ...item, name: event.target.value })}
                placeholder="Platform name"
                className={baseInput}
              />
              <input
                type="text"
                value={item.href ?? ""}
                onChange={(event) => updateItem(index, { ...item, href: event.target.value })}
                placeholder="https://..."
                className={baseInput}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-2.5 text-zinc-500 hover:bg-zinc-100"
                aria-label="Remove social"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <Plus size={14} />
          Add Social Link
        </button>
      </div>
    );
  }

  if (field.type === "string-list") {
    const list = Array.isArray(value) ? value.map((item) => String(item)) : [];

    const updateItem = (index: number, next: string) => {
      onChange(list.map((item, i) => (i === index ? next : item)));
    };

    const removeItem = (index: number) => {
      onChange(list.filter((_, i) => i !== index));
    };

    const addItem = () => {
      onChange([...list, ""]);
    };

    return (
      <div className="space-y-2.5">
        {list.map((item, index) => (
          <div key={`${field.key}-${index}`} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={field.placeholder}
              className={baseInput}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-2.5 py-2 text-zinc-500 hover:bg-zinc-100"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <Plus size={14} />
          Add Item
        </button>
      </div>
    );
  }

  if (field.type === "image-list") {
    const list = Array.isArray(value) ? value.map((item) => String(item)) : [];

    const updateItem = (index: number, next: string) => {
      onChange(list.map((item, i) => (i === index ? next : item)));
    };

    const removeItem = (index: number) => {
      onChange(list.filter((_, i) => i !== index));
    };

    const addItem = () => {
      onChange([...list, ""]);
    };

    return (
      <div className="space-y-3">
        {list.map((item, index) => (
          <div key={`${field.key}-${index}`} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
            <div className="space-y-2">
              <ImageUploader
                currentUrl={item}
                onUpload={(url) => updateItem(index, url)}
                buttonLabel={`Upload Image ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
                aria-label="Remove image"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <Plus size={14} />
          Add Image
        </button>
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <div className="space-y-3">
        {textValue ? (
          <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600 break-all">
            {textValue}
          </p>
        ) : null}
        <ImageUploader currentUrl={textValue} onUpload={onChange as (url: string) => void} />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={textValue}
        onChange={(event) => onChange(fromTextValue(event.target.value, field.type))}
        rows={5}
        placeholder={field.placeholder}
        className={cn(baseInput, "resize-y min-h-[120px]")}
      />
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        value={textValue}
        onChange={(event) => onChange(fromTextValue(event.target.value, "number"))}
        className={cn(baseInput, "w-32")}
      />
    );
  }

  return (
    <input
      type="text"
      value={textValue}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      className={baseInput}
    />
  );
}
