"use client";

import { useEffect, useRef, useState } from "react";
import { saveProfileDesignDraftApi } from "@/lib/frontend/api/services";

function cleanDeep<T extends Record<string, any>>(obj?: T): Partial<T> {
  if (!obj || typeof obj !== "object") return {};
  const out: any = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string") {
      if (v.trim() === "") continue;
      out[k] = v;
      continue;
    }
    if (typeof v === "object") {
      if (Array.isArray(v)) {
        out[k] = v;
        continue;
      }
      const nested = cleanDeep(v as any);
      if (Object.keys(nested).length > 0) out[k] = nested;
      continue;
    }
    out[k] = v;
  }
  return out;
}

export default function useAutoSaveDraft({
  profile,
  design,
  settings,
  enabled = true,
  debounceMs = 1500,
}: {
  profile: any;
  design: any;
  settings: any;
  enabled?: boolean;
  debounceMs?: number;
}) {
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const payloadRef = useRef<any>(null);
  const pendingRef = useRef(false);

  const scheduleSave = () => {
    if (!enabled) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => doSave(),
      debounceMs
    ) as unknown as number;
  };

  const doSave = async () => {
    const clean = {
      profile: cleanDeep(profile),
      design: cleanDeep(design),
      settings: cleanDeep(settings),
    };
    payloadRef.current = clean;
    pendingRef.current = true;
    setSaving(true);
    try {
      if (typeof saveProfileDesignDraftApi === "function") {
        await saveProfileDesignDraftApi({ ...clean });
      } else {
        await fetch("/api/admin/profile-design/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...clean }),
          credentials: "include",
        });
      }
      setLastSavedAt(Date.now());
      pendingRef.current = false;
    } catch {
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    scheduleSave();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [profile, design, settings, enabled]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!payloadRef.current) return;
      const payloadJson = JSON.stringify(payloadRef.current);
      try {
        const blob = new Blob([payloadJson], { type: "application/json" });
        navigator.sendBeacon?.("/api/admin/profile-design/draft", blob);
      } catch {
        try {
          navigator.sendBeacon?.(
            "/api/admin/profile-design/draft",
            payloadJson
          );
        } catch {
          try {
            fetch("/api/admin/profile-design/draft", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: payloadJson,
              keepalive: true,
              credentials: "include",
            });
          } catch {}
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return {
    saving,
    lastSavedAt,
    triggerSave: doSave,
    pending: pendingRef.current,
  };
}
