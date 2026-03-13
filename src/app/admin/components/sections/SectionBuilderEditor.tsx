"use client";

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
import { GripVertical, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  HOMEPAGE_SECTION_DEFINITIONS,
  isHomepageSectionKey,
  normalizeHomepageSectionOrder,
} from "@/lib/admin/homepageSections";

type SectionBuilderRow = {
  id: string;
  section_key: string;
  title: string;
  sort_order: number;
};

type SectionBuilderEditorProps = {
  addToast: (type: "success" | "error", message: string) => void;
};

type SortableSectionRowProps = {
  row: SectionBuilderRow;
  index: number;
  totalRows: number;
};

function SortableSectionRow({ row, index, totalRows }: SortableSectionRowProps) {
  const id = String(row.id);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-md border border-zinc-200 bg-zinc-50 p-2 text-zinc-500 hover:bg-zinc-100"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={14} />
        </button>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-[15px] font-semibold text-zinc-900">{row.title}</h4>
          <p className="text-xs text-zinc-500 mt-0.5">Key: {row.section_key}</p>
        </div>

        <span className="hidden md:flex items-center justify-center h-8 w-8 rounded-md bg-zinc-100 text-[11px] font-semibold text-zinc-600">
          {index + 1}/{totalRows}
        </span>
      </div>
    </div>
  );
}

function normalizeRows(rows: SectionBuilderRow[]) {
  const fallbackTitleByKey = new Map<string, string>(
    HOMEPAGE_SECTION_DEFINITIONS.map((item) => [item.key, item.title])
  );

  const rowByKey = new Map<string, SectionBuilderRow>();
  const persistedOrder: string[] = [];

  for (const row of rows.slice().sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))) {
    const key = String(row.section_key ?? "").trim().toLowerCase();
    if (!isHomepageSectionKey(key)) continue;
    if (!key || rowByKey.has(key)) continue;

    persistedOrder.push(key);
    rowByKey.set(key, {
      ...row,
      section_key: key,
      title: String(row.title ?? "").trim() || fallbackTitleByKey.get(key) || key,
      sort_order: Number(row.sort_order ?? 0),
    });
  }

  const orderedKeys = normalizeHomepageSectionOrder(persistedOrder);

  return orderedKeys
    .map((key, index) => {
      const existing = rowByKey.get(key);
      return {
        id: existing?.id ?? "",
        section_key: key,
        title: existing?.title ?? fallbackTitleByKey.get(key) ?? key,
        sort_order: index + 1,
      } satisfies SectionBuilderRow;
    })
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function SectionBuilderEditor({ addToast }: SectionBuilderEditorProps) {
  const [rows, setRows] = useState<SectionBuilderRow[]>([]);
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
    try {
      const response = await fetch("/api/admin/section_order");
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const payload = (await response.json()) as { error?: string } | SectionBuilderRow[];
      if (!response.ok) {
        throw new Error("error" in payload ? payload.error ?? "Failed to load section builder" : "Failed to load section builder");
      }

      const normalized = normalizeRows(Array.isArray(payload) ? payload : []);
      const missingRows = normalized.filter((item) => !String(item.id).trim());

      if (missingRows.length > 0) {
        await Promise.all(
          missingRows.map(async (item) => {
            const createResponse = await fetch("/api/admin/section_order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                section_key: item.section_key,
                title: item.title,
                sort_order: item.sort_order,
              }),
            });

            if (!createResponse.ok) {
              const createPayload = (await createResponse.json().catch(() => null)) as { error?: string } | null;
              throw new Error(createPayload?.error ?? "Failed to initialize section order");
            }
          })
        );

        const reloadResponse = await fetch("/api/admin/section_order");
        if (!reloadResponse.ok) {
          const reloadPayload = (await reloadResponse.json().catch(() => null)) as { error?: string } | null;
          throw new Error(reloadPayload?.error ?? "Failed to load section builder");
        }

        const reloaded = (await reloadResponse.json()) as SectionBuilderRow[];
        setRows(normalizeRows(Array.isArray(reloaded) ? reloaded : []));
        return;
      }

      setRows(normalized);
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Failed to load section builder");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const persistRows = useCallback(
    async (nextRows: SectionBuilderRow[]) => {
      setSaving(true);
      try {
        const updates = nextRows.map((item) => ({
          id: item.id,
          section_key: item.section_key,
          title: item.title,
          sort_order: item.sort_order,
        }));

        await Promise.all(
          updates.map(async (item) => {
            const response = await fetch("/api/admin/section_order", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            });

            if (!response.ok) {
              const payload = (await response.json().catch(() => null)) as { error?: string } | null;
              throw new Error(payload?.error ?? "Failed to save section order");
            }
          })
        );

        addToast("success", "Homepage section order updated");
      } catch (error) {
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [addToast]
  );

  const orderedRows = useMemo(() => rows.slice().sort((a, b) => a.sort_order - b.sort_order), [rows]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || saving) return;

    const oldIndex = orderedRows.findIndex((row) => row.id === active.id);
    const newIndex = orderedRows.findIndex((row) => row.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const previousRows = orderedRows;
    const moved = arrayMove(orderedRows, oldIndex, newIndex);
    const nextRows = moved.map((row, index) => ({ ...row, sort_order: index + 1 }));
    setRows(nextRows);

    try {
      await persistRows(nextRows);
    } catch (error) {
      setRows(previousRows);
      addToast("error", error instanceof Error ? error.message : "Failed to save section order");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12 text-zinc-500">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading section builder...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 bg-white p-4 text-xs text-zinc-500">
        Drag sections to reorder them. Changes are saved automatically.
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedRows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {orderedRows.map((row, index) => (
              <SortableSectionRow key={row.id} row={row} index={index} totalRows={orderedRows.length} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {saving && (
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Loader2 size={14} className="animate-spin" />
          Saving section order...
        </div>
      )}
    </div>
  );
}
