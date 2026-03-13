import type { FieldConfig, SectionRecord } from "@/lib/admin/types";

export type PendingUploadValue = {
  __type: "pending-upload";
  file: File;
  previewUrl: string;
  originalUrl?: string;
};

export function isPendingUploadValue(value: unknown): value is PendingUploadValue {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as { __type?: unknown; file?: unknown; previewUrl?: unknown };
  return (
    candidate.__type === "pending-upload" &&
    typeof File !== "undefined" &&
    candidate.file instanceof File &&
    typeof candidate.previewUrl === "string"
  );
}

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const payload = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;

  if (!res.ok) {
    throw new Error(payload?.error ?? "Image upload failed");
  }

  if (!payload?.url) {
    throw new Error("Image upload response missing URL");
  }

  return payload.url;
}

export async function resolvePendingUploads(data: SectionRecord, fields: FieldConfig[]) {
  const next: SectionRecord = { ...data };

  for (const field of fields) {
    const value = next[field.key];

    if (field.type === "image" && isPendingUploadValue(value)) {
      try {
        const uploadedUrl = await uploadFile(value.file);
        next[field.key] = uploadedUrl;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Image upload failed";
        throw new Error(`${field.label}: ${message}`);
      } finally {
        URL.revokeObjectURL(value.previewUrl);
      }
      continue;
    }

    if (field.type === "image-list" && Array.isArray(value)) {
      const resolvedList: string[] = [];

      for (const item of value) {
        if (isPendingUploadValue(item)) {
          try {
            const uploadedUrl = await uploadFile(item.file);
            resolvedList.push(uploadedUrl);
          } catch (error) {
            const message = error instanceof Error ? error.message : "Image upload failed";
            throw new Error(`${field.label}: ${message}`);
          } finally {
            URL.revokeObjectURL(item.previewUrl);
          }
        } else {
          resolvedList.push(String(item ?? ""));
        }
      }

      next[field.key] = resolvedList;
    }
  }

  return next;
}
