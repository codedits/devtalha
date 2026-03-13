import type { FieldType } from "@/lib/admin/types";

export function toTextValue(value: unknown, type: FieldType): string {
  if (type === "number") {
    if (typeof value === "number") return String(value);
    if (typeof value === "string") return value;
    return "0";
  }

  return typeof value === "string" ? value : "";
}

export function fromTextValue(value: string, type: FieldType): unknown {
  if (type === "number") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return value;
}
