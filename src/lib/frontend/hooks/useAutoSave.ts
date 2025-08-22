"use client";

import { useEffect, useRef } from "react";

export function useAutoSave(form: any) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestForm = useRef(form);
  const inflight = useRef<AbortController | null>(null);

  useEffect(() => {
    latestForm.current = form;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      saveData(latestForm.current);
    }, 800);
  }, [form]);

  async function saveData(data: any) {
    try {
      inflight.current?.abort();
      inflight.current = new AbortController();
      await fetch("/api/dashboard/save", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        signal: inflight.current.signal,
      });
    } catch (error: any) {
      if (error?.name !== "AbortError")
        console.error("Auto-save error:", error);
    }
  }
}
