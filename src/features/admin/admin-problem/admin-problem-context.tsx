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
import { ProblemStatus } from "@/features/problems/models/problem-status";

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
  const { getAccessTokenSilently } = useAccount();

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
      const token = await getAccessTokenSilently();

      if (token) {
        setAccessToken(token);
      }
    })();
  }, [getAccessTokenSilently]);

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
