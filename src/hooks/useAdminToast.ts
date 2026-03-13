"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Toast } from "@/lib/admin/types";

export function useAdminToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const timeoutIds = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeoutIds.current.clear();
    };
  }, []);

  const addToast = useCallback((type: "success" | "error", message: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, message }]);

    const timeoutId = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      timeoutIds.current.delete(id);
    }, 4000);

    timeoutIds.current.set(id, timeoutId);
  }, []);

  const dismissToast = useCallback((id: number) => {
    const timeoutId = timeoutIds.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutIds.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    dismissToast,
  };
}
