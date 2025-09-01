"use client";

import { createContext, useContext } from "react";
import type { FormData } from "@/lib/frontend/types/form";

interface UserPageContextType {
  data: FormData | null;
}

const UserPageContext = createContext<UserPageContextType>({ data: null });

export function UserPageProvider({
  data,
  children,
}: {
  data: FormData | null;
  children: React.ReactNode;
}) {
  return (
    <UserPageContext.Provider value={{ data }}>
      {children}
    </UserPageContext.Provider>
  );
}

export function useUserPage() {
  return useContext(UserPageContext);
}
