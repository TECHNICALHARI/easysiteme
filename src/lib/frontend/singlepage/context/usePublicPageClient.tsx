"use client";
import { useEffect, useState } from "react";
import { fetchPublicPageClient, fetchPublicPostsClient } from "@/lib/frontend/api/publicPages";

export function usePublicPage(username: string, initialEtag?: string | null) {
  const [loading, setLoading] = useState(false);
  const [etag, setEtag] = useState<string | null | undefined>(initialEtag ?? null);
  const [data, setData] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const r = await fetchPublicPageClient(username, etag ?? null);
        if (cancelled) return;
        if (r.status === 304) {
        } else {
          setData(r.data);
          setEtag(r.etag ?? null);
        }
      } catch (err: any) {
        setError(err?.message ?? "Failed");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    let cancelled = false;
    async function loadPosts() {
      try {
        const r = await fetchPublicPostsClient(username, null);
        if (cancelled) return;
        setPosts(r.data?.posts ?? null);
      } catch {
      }
    }
    loadPosts();
    return () => { cancelled = true; };
  }, [username]);

  return { loading, data, posts, etag, error };
}
