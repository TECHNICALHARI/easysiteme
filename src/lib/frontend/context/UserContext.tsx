'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type UserPublic = {
    id: string | null;
    subdomain?: string | null;
    email: string | null;
    mobile: string | null;
    countryCode: string | null;
    emailVerified: boolean;
    mobileVerified: boolean;
    roles: string[];
    plan: string | null;
    createdAt: string | null;
};

type UserContextValue = {
    user: UserPublic | null;
    isBootstrapped: boolean;
    isRefreshing: boolean;
    error: Error | null;
    refresh: (opts?: { force?: boolean }) => Promise<void>;
    logout: (opts?: { callServer?: boolean; redirectTo?: string | null; noRedirect?: boolean }) => Promise<void>;
    setUserDirectly: (u: UserPublic | null) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const CLIENT_EVENT_KEY = "myeasypage:auth:event";
const CLIENT_PREFIX = "myeasypage:";
function clearClientPrefixed(prefix = CLIENT_PREFIX) {
    try {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k) continue;
            if (k.startsWith(prefix)) keys.push(k);
        }
        keys.forEach((k) => localStorage.removeItem(k));
    } catch { }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<UserPublic | null>(null);
    const [isBootstrapped, setIsBootstrapped] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const cacheRef = useRef<{ user?: UserPublic; etag?: string; ts?: number }>({});
    const refreshPromiseRef = useRef<Promise<void> | null>(null);
    const bcRef = useRef<BroadcastChannel | null>(null);

    console.log(user, "user")

    const broadcast = (msg: any) => {
        try {
            if (bcRef.current) bcRef.current.postMessage(msg);
            else localStorage.setItem(CLIENT_EVENT_KEY, JSON.stringify({ t: Date.now(), ...msg }));
        } catch { }
    };

    const handleUnauthorized = () => {
        setUser(null);
        cacheRef.current = {};
        clearClientPrefixed();
        broadcast({ type: "auth:logout" });
        const next = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
        router.push(`/login?next=${encodeURIComponent(next)}`);
    };

    const fetchOnce = async (opts?: { etag?: string; force?: boolean }) => {
        const headers: Record<string, string> = {};
        if (!opts?.force && opts?.etag) headers["If-None-Match"] = opts.etag;
        const res = await fetch("/api/user/me", { credentials: "include", headers });
        if (res.status === 401) {
            handleUnauthorized();
            throw new Error("Unauthorized");
        }
        if (res.status === 304) {
            return { unchanged: true, user: cacheRef.current.user ?? null, etag: opts?.etag ?? cacheRef.current.etag };
        }
        if (!res.ok) {
            const txt = await res.text().catch(() => "");
            throw new Error(txt || `HTTP ${res.status}`);
        }
        const json = await res.json();
        const newUser = json?.data?.user ?? null;
        const etag = res.headers.get("ETag") ?? res.headers.get("etag") ?? undefined;
        return { unchanged: false, user: newUser, etag };
    };

    const refresh = async (opts?: { force?: boolean }) => {
        if (refreshPromiseRef.current) return refreshPromiseRef.current;
        const p = (async () => {
            setIsRefreshing(true);
            setError(null);
            try {
                const cachedEtag = cacheRef.current.etag;
                const result = await fetchOnce({ etag: cachedEtag, force: Boolean(opts?.force) });
                if (!result.unchanged) {
                    cacheRef.current = { user: result.user ?? undefined, etag: result.etag ?? undefined, ts: Date.now() };
                    setUser(result.user);
                    broadcast({ type: "auth:refresh", user: result.user ?? null, etag: result.etag ?? null });
                } else {
                    if (cacheRef.current.user) setUser(cacheRef.current.user);
                }
            } catch (err: any) {
                setError(err);
            } finally {
                setIsRefreshing(false);
                setIsBootstrapped(true);
                refreshPromiseRef.current = null;
            }
        })();
        refreshPromiseRef.current = p;
        return p;
    };

    const setUserDirectly = (u: UserPublic | null) => {
        cacheRef.current = { user: u ?? undefined, etag: undefined, ts: Date.now() };
        setUser(u);
        setIsBootstrapped(true);
        broadcast({ type: "auth:refresh", user: u ?? null, etag: null });
    };

    const logout = async (opts?: { callServer?: boolean; redirectTo?: string | null; noRedirect?: boolean }) => {
        const callServer = typeof opts?.callServer === "undefined" ? true : Boolean(opts?.callServer);
        if (callServer) {
            try {
                await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
            } catch { }
        }
        setUser(null);
        cacheRef.current = {};
        clearClientPrefixed();
        broadcast({ type: "auth:logout" });
        if (!opts?.noRedirect) {
            const next = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
            const redirectTo = typeof opts?.redirectTo === "undefined" ? "/login" : opts?.redirectTo;
            if (redirectTo) router.push(`${redirectTo}?next=${encodeURIComponent(next)}`);
        }
    };

    useEffect(() => {
        try {
            bcRef.current = new BroadcastChannel("myeasypage_auth");
            bcRef.current.onmessage = (ev) => {
                const msg = ev.data;
                if (!msg) return;
                if (msg.type === "auth:logout") {
                    setUser(null);
                    cacheRef.current = {};
                    clearClientPrefixed();
                    const next = window.location.pathname + window.location.search;
                    router.push(`/login?next=${encodeURIComponent(next)}`);
                } else if (msg.type === "auth:refresh") {
                    cacheRef.current = { user: msg.user ?? undefined, etag: msg.etag ?? undefined, ts: Date.now() };
                    setUser(msg.user ?? null);
                }
            };
        } catch {
            bcRef.current = null;
            const onStorage = (ev: StorageEvent) => {
                if (ev.key !== CLIENT_EVENT_KEY) return;
                try {
                    const v = JSON.parse(String(ev.newValue || "{}"));
                    if (v.type === "auth:logout") {
                        setUser(null);
                        cacheRef.current = {};
                        clearClientPrefixed();
                        const next = window.location.pathname + window.location.search;
                        router.push(`/login?next=${encodeURIComponent(next)}`);
                    } else if (v.type === "auth:refresh") {
                        cacheRef.current = { user: v.user ?? undefined, etag: v.etag ?? undefined, ts: Date.now() };
                        setUser(v.user ?? null);
                    }
                } catch { }
            };
            window.addEventListener("storage", onStorage);
            return () => window.removeEventListener("storage", onStorage);
        }
    }, [router]);

    useEffect(() => {
        const cached = cacheRef.current;
        if (cached?.user && cached.ts && Date.now() - cached.ts < 60 * 1000) {
            setUser(cached.user);
            setIsBootstrapped(true);
        } else {
            (async () => {
                try {
                    await refresh();
                } catch { }
            })();
        }
    }, []);

    const ctx: UserContextValue = {
        user,
        isBootstrapped,
        isRefreshing,
        error,
        refresh,
        logout,
        setUserDirectly,
    };

    return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>;
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
}
