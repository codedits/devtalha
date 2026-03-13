"use client";

import { LayoutDashboard } from "lucide-react";

import type { SectionConfig } from "@/lib/admin/types";

type TopBarProps = {
  activeSection: string | null;
  config: SectionConfig | null;
  onOpenSidebar: () => void;
  onBack: () => void;
};

export function TopBar({ activeSection, config, onOpenSidebar, onBack }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="md:hidden rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <LayoutDashboard size={18} />
          </button>
          <div>
            <h2 className="text-[15px] font-semibold text-zinc-900">{config ? config.title : "Dashboard"}</h2>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              {config ? config.description : "Overview of all portfolio sections"}
            </p>
          </div>
        </div>

        {activeSection && (
          <button
            onClick={onBack}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Back
          </button>
        )}
      </div>
    </header>
  );
}
