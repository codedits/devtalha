"use client";

import Image from "next/image";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  GripVertical,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { SectionForm } from "@/app/admin/components/sections/SectionForm";
import { resolvePendingUploads } from "@/lib/admin/uploads";
import type { SectionConfig, SectionRecord } from "@/lib/admin/types";

type SortableRowProps = {
  row: SectionRecord;
  index: number;
  totalRows: number;
  onEdit: (row: SectionRecord) => void;
  onDelete: (id: string) => void;
};

function SortableRow({ row, index, totalRows, onEdit, onDelete }: SortableRowProps) {
  const id = String(row.id);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const title = String(row.title ?? row.number ?? row.label ?? `Item ${index + 1}`);
  const subtitle = String(row.client ?? row.email ?? row.description ?? "").slice(0, 80);
  const imgUrl = String(row.image_url ?? "");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-md border border-zinc-200 bg-zinc-50 p-2 text-zinc-500 hover:bg-zinc-100"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={14} />
        </button>

        {imgUrl && (
          <div className="relative hidden sm:block h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-zinc-200">
            <Image
              src={imgUrl}
              alt=""
              fill
              unoptimized
              sizes="56px"
              className="object-cover"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-[15px] font-semibold text-zinc-900">{title}</h4>
          {subtitle && <p className="truncate text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>

        <span className="hidden md:flex items-center justify-center h-8 w-8 rounded-md bg-zinc-100 text-[11px] font-semibold text-zinc-600">
          {index + 1}/{totalRows}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(row)}
            className="rounded-md border border-transparent p-2 text-zinc-500 transition hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-700"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(String(row.id))}
            className="rounded-md border border-transparent p-2 text-red-500/70 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

type CollectionSectionEditorProps = {
  config: SectionConfig;
  addToast: (type: "success" | "error", message: string) => void;
};

export function CollectionSectionEditor({ config, addToast }: CollectionSectionEditorProps) {
  const [rows, setRows] = useState<SectionRecord[]>([]);
  const [editing, setEditing] = useState<SectionRecord | null>(null);
  const [originalEditing, setOriginalEditing] = useState<SectionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadRows = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/${config.section}`);
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }

    const payload = await res.json();
    if (!res.ok) {
      addToast("error", payload.error ?? "Failed to load data");
      setLoading(false);
      return;
    }

    setRows((payload as SectionRecord[]) ?? []);
    setLoading(false);
  }, [config.section, addToast]);

  useEffect(() => {
    setEditing(null);
    setOriginalEditing(null);
    loadRows();
  }, [loadRows]);

  const createEmptyRow = () =>
    ({
      id: "",
      ...(config.createDefaults ?? {}),
      sort_order: rows.length + 1,
    }) as SectionRecord;

  const upsertRow = async (record: SectionRecord) => {
    const id = String(record.id ?? "");
    const isNew = !id;
    const method = isNew ? "POST" : "PUT";
    const tempId = `temp-${Date.now()}`;
    const optimistic = isNew ? { ...record, id: tempId } : record;
    const previousRows = rows;

    if (isNew) setRows((current) => [...current, optimistic]);
    else setRows((current) => current.map((row) => (String(row.id) === id ? optimistic : row)));

    setSaving(true);
    try {
      const resolvedRecord = await resolvePendingUploads(record, config.fields);
      const payloadRecord =
        isNew && !String(resolvedRecord.id ?? "").trim()
          ? (({ id: _id, ...rest }) => rest)(resolvedRecord)
          : resolvedRecord;

      const res = await fetch(`/api/admin/${config.section}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadRecord),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Save failed");
      const saved = payload as SectionRecord;
      if (isNew) setRows((current) => current.map((row) => (String(row.id) === tempId ? saved : row)));
      else setRows((current) => current.map((row) => (String(row.id) === String(saved.id) ? saved : row)));
      setEditing(null);
      setOriginalEditing(null);
      addToast("success", isNew ? "Item created" : "Item updated");
    } catch (error) {
      setRows(previousRows);
      addToast("error", error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeRow = async (id: string) => {
    const previousRows = rows;
    setRows((current) => current.filter((row) => String(row.id) !== id));
    try {
      const res = await fetch(`/api/admin/${config.section}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Delete failed");
      addToast("success", "Item deleted");
    } catch (error) {
      setRows(previousRows);
      addToast("error", error instanceof Error ? error.message : "Delete failed");
    }
  };

  const openEditor = (record: SectionRecord) => {
    setEditing(record);
    setOriginalEditing(record);
  };

  const hasRecordChanged = useMemo(
    () =>
      editing && originalEditing
        ? JSON.stringify(editing) !== JSON.stringify(originalEditing)
        : false,
    [editing, originalEditing]
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((row) => String(row.id) === String(active.id));
    const newIndex = rows.findIndex((row) => String(row.id) === String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const previousRows = rows;
    const moved = arrayMove(rows, oldIndex, newIndex);
    const nextRows: SectionRecord[] = moved.map((row, index) => ({
      ...row,
      sort_order: index + 1,
    }));
    setRows(nextRows);

    try {
      const previousSortById = new Map(
        previousRows.map((row) => [String(row["id"] ?? ""), Number(row["sort_order"] ?? 0)])
      );

      const updates = nextRows.filter((row, index) => {
        const id = String(row["id"] ?? "");
        if (!id.trim()) return false;
        return previousSortById.get(id) !== index + 1;
      });

      await Promise.all(
        updates.map(async (item) => {
          const response = await fetch(`/api/admin/${config.section}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });

          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as { error?: string } | null;
            throw new Error(payload?.error ?? "Failed to update order");
          }
        })
      );

      addToast("success", "Order updated");
    } catch (error) {
      setRows(previousRows);
      addToast("error", error instanceof Error ? error.message : "Reorder failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12 text-zinc-500">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading {config.title}...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rows.map((row) => String(row.id))} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {rows.map((row, index) => (
              <SortableRow
                key={String(row.id)}
                row={row}
                index={index}
                totalRows={rows.length}
                onEdit={openEditor}
                onDelete={removeRow}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={() => openEditor(createEmptyRow())}
        className="w-full rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-4 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100 flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add New {config.title.replace(/s$/, "")}
      </button>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setEditing(null);
            setOriginalEditing(null);
          }}
        >
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" />
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  {String(editing.id) ? "Edit" : "New"} {config.title.replace(/s$/, "")}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Fill in the details below</p>
              </div>
              <button
                onClick={() => {
                  setEditing(null);
                  setOriginalEditing(null);
                }}
                className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X size={18} />
              </button>
            </div>

            <SectionForm fields={config.fields} data={editing} onChange={setEditing} />

            <div className="sticky bottom-0 mt-8 -mx-6 border-t border-zinc-200 bg-white px-6 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-zinc-500">{hasRecordChanged ? "Unsaved changes" : "No changes yet"}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => upsertRow(editing)}
                    disabled={saving || !hasRecordChanged}
                    className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? "Saving..." : "Save Item"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(null);
                      setOriginalEditing(null);
                    }}
                    className="rounded-md border border-zinc-300 px-4 py-2.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
