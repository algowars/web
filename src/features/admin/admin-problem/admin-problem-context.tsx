"use client";

import { AdminProblem } from "@/features/problems/models/admin-problem";
import { ProblemSetup } from "@/features/problems/models/problem-setup";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAdminProblem } from "../api/get-admin-problem";
import { useAccount } from "@/features/auth/account.context";
import { getAccessToken } from "@auth0/nextjs-auth0";

interface AdminProblemContextState {
  problem: AdminProblem | null;
  isLoading: boolean;
  error: { message: string } | null;
  setups: ProblemSetup[];
}

const AdminProblemContext = createContext<AdminProblemContextState | null>(
  null
);

interface AdminProblemProviderProps {
  children?: ReactNode;
  slug: string;
}

export function AdminProblemProvider({
  children,
  slug,
}: AdminProblemProviderProps) {
  const [accessToken, setAccessToken] = useState("");
  const { isAuthenticated } = useAccount();

  const { data, isLoading, error } = useAdminProblem({
    slug,
    accessToken,
  });

  const contextValue: AdminProblemContextState = {
    problem: data?.problem ?? null,
    isLoading,
    error: error ? { message: error.message } : null,
    setups: [],
  };

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const token = await getAccessToken();

        if (token) {
          setAccessToken(token);
        }
      }
    })();
  }, [isAuthenticated]);

  return (
    <AdminProblemContext.Provider value={contextValue}>
      {children}
    </AdminProblemContext.Provider>
  );
}

export function useAdminProblemContext() {
  const context = useContext(AdminProblemContext);
  if (context === undefined) {
    throw new Error(
      "useAdminProblemContext must be used within an AdminProblemProvider"
    );
  }

  return context;
}
