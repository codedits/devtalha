"use client";

import { Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { SectionForm } from "@/app/admin/components/sections/SectionForm";
import type { SectionConfig, SectionRecord } from "@/lib/admin/types";

type SingleSectionEditorProps = {
  config: SectionConfig;
  addToast: (type: "success" | "error", message: string) => void;
};

export function SingleSectionEditor({ config, addToast }: SingleSectionEditorProps) {
  const [data, setData] = useState<SectionRecord | null>(null);
  const [originalData, setOriginalData] = useState<SectionRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
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

      setData(payload as SectionRecord);
      setOriginalData(payload as SectionRecord);
    } catch {
      addToast("error", "Network error while loading data");
    } finally {
      setLoading(false);
    }
  }, [config.section, addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/${config.section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Save failed");
      setData(payload as SectionRecord);
      setOriginalData(payload as SectionRecord);
      addToast("success", `${config.title} saved successfully`);
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
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

  if (!data) return null;

  const isDirty = originalData ? JSON.stringify(data) !== JSON.stringify(originalData) : false;

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
        <SectionForm fields={config.fields} data={data} onChange={setData} />
      </div>
      {isDirty && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
