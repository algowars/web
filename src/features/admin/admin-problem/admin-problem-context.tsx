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
    problem: {
      id: "12303-1233-3213-1231",
      slug: "buy-sell-stock",
      title: "Buy Sell Stock",
      tags: ["test", "test2", "test3"],
      difficulty: {
        rating: 1234,
        name: "Easy",
      },
      status: ProblemStatus.ACCEPTED,
      createdAt: new Date(),
      updatedAt: new Date(),
      availableLanguages: [
        {
          id: 1,
          name: "JavaScript",
          versions: [
            { id: 101, version: "ES6" },
            { id: 102, version: "ES2020" },
          ],
        },
        {
          id: 2,
          name: "Python",
          versions: [
            { id: 201, version: "3.8" },
            { id: 202, version: "3.11" },
          ],
        },
        {
          id: 3,
          name: "Java",
          versions: [
            { id: 301, version: "8" },
            { id: 302, version: "17" },
          ],
        },
      ],
      createdBy: {
        username: "shadcn123",
        id: "123-123-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
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
