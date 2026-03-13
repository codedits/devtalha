"use client";

import { AlertCircle, Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Toast } from "@/lib/admin/types";

type ToastContainerProps = {
  toasts: Toast[];
  onDismiss: (id: number) => void;
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-center gap-2.5 rounded-md border px-3 py-2 text-sm shadow-sm bg-white",
            toast.type === "success"
              ? "border-emerald-200 text-emerald-800"
              : "border-red-200 text-red-700"
          )}
        >
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => onDismiss(toast.id)} className="ml-1 opacity-50 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
