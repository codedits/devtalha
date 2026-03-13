"use client";

import { useCallback, useRef, useState } from "react";

import type { Toast } from "@/lib/admin/types";

export function useAdminToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const addToast = useCallback((type: "success" | "error", message: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    dismissToast,
  };
}
