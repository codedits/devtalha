"use client";

import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";

import { SECTION_CONFIGS } from "@/lib/admin/config";
import { cn } from "@/lib/utils";

type SidebarProps = {
  activeSection: string | null;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
  onOpenDashboard: () => void;
  onNavigate: (section: string) => void;
  onLogout: () => void;
};

export function Sidebar({
  activeSection,
  sidebarOpen,
  onCloseSidebar,
  onOpenDashboard,
  onNavigate,
  onLogout,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-full w-[280px] border-r border-zinc-200 bg-white flex flex-col transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="px-6 py-5 border-b border-zinc-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold tracking-tight text-zinc-900">Portfolio CMS</h1>
            <p className="text-[11px] text-zinc-500 mt-0.5">Admin Workspace</p>
          </div>
          <button onClick={onCloseSidebar} className="md:hidden text-zinc-500 hover:text-zinc-800">
            <X size={18} />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <button
          onClick={onOpenDashboard}
          className={cn(
            "w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition",
            activeSection === null ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>

        <div className="pt-4 pb-2 px-3">
          <span className="text-[11px] font-medium text-zinc-500">Sections</span>
        </div>

        {SECTION_CONFIGS.map((section) => (
          <button
            key={section.section}
            onClick={() => onNavigate(section.section)}
            className={cn(
              "w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition",
              activeSection === section.section
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            )}
          >
            {section.icon}
            {section.title}
          </button>
        ))}
      </nav>

      <div className="border-t border-zinc-200 p-3 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition"
        >
          <ExternalLink size={16} />
          View Live Site
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium text-red-600/80 hover:bg-red-50 hover:text-red-700 transition"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
