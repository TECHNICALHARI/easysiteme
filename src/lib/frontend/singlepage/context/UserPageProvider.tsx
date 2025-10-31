"use client";
import React, { createContext, useContext, useState } from "react";
import type { FormData } from "@/lib/frontend/types/form";

type UserPageContextType = {
  data: FormData | null;
  setData: (d: FormData | null) => void;
  etag: string | null;
  setEtag: (e: string | null) => void;
};

const UserPageContext = createContext<UserPageContextType | undefined>(undefined);

export function UserPageProvider({
  initialData,
  initialEtag,
  children,
}: {
  initialData: FormData | null;
  initialEtag?: string | null;
  children: React.ReactNode;
}) {
  const [data, setData] = useState<FormData | null>(initialData ?? null);
  const [etag, setEtag] = useState<string | null>(initialEtag ?? null);
  return (
    <UserPageContext.Provider value={{ data, setData, etag, setEtag }}>
      {children}
    </UserPageContext.Provider>
  );
}

export function useUserPage() {
  const ctx = useContext(UserPageContext);
  if (!ctx) throw new Error("useUserPage must be used within UserPageProvider");
  return ctx;
}
