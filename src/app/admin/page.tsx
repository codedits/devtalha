"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DashboardOverview,
  Sidebar,
  ToastContainer,
  TopBar,
} from "@/app/admin/components";
import {
  CollectionSectionEditor,
  SingleSectionEditor,
} from "@/app/admin/components/sections";
import { useAdminToast } from "@/hooks/useAdminToast";
import { SECTION_CONFIGS } from "@/lib/admin/config";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { toasts, addToast, dismissToast } = useAdminToast();

  const config = useMemo(
    () => (activeSection ? SECTION_CONFIGS.find((section) => section.section === activeSection) ?? null : null),
    [activeSection]
  );

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const handleNavigation = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-zinc-900/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
        onOpenDashboard={() => {
          setActiveSection(null);
          setSidebarOpen(false);
        }}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />

      <div className="md:ml-[280px]">
        <TopBar
          activeSection={activeSection}
          config={config}
          onOpenSidebar={() => setSidebarOpen(true)}
          onBack={() => setActiveSection(null)}
        />

        <main className="p-6 md:p-8 max-w-6xl">
          {!config ? (
            <DashboardOverview onNavigate={handleNavigation} />
          ) : config.mode === "single" ? (
            <SingleSectionEditor config={config} addToast={addToast} />
          ) : (
            <CollectionSectionEditor config={config} addToast={addToast} />
          )}
        </main>
      </div>
    </div>
  );
}
