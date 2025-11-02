"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useAvailableLanguages } from "../problems/api/get-available-languages";
import { Language } from "../problems/models/language";
import { PageResult } from "@/common/pagination/page-result";
import { UseQueryResult } from "@tanstack/react-query";

type CreateProblemState = {
  title: string;
  question: string;
  tags: string[];
  slug: string;
};

type CreateProblemContextType = {
  createProblem: CreateProblemState;
  availableLanguages: UseQueryResult<Language[]>;
  updateCreateProblem: (fields: Partial<CreateProblemState>) => void;
};

const defaultState: CreateProblemState = {
  title: "",
  question: "",
  tags: [],
  slug: "",
};

const CreateProblemContext = createContext<
  CreateProblemContextType | undefined
>(undefined);

export function CreateProblemProvider({ children }: { children: ReactNode }) {
  const [createProblem, setCreateProblem] =
    useState<CreateProblemState>(defaultState);
  const [accessToken, setAccessToken] = useState<string>("");
  const availableLanguages = useAvailableLanguages({ accessToken });

  const updateCreateProblem = (fields: Partial<CreateProblemState>) => {
    setCreateProblem((prev) => ({ ...prev, ...fields }));
  };

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();

      if (accessToken) {
        setAccessToken(accessToken);
      }
    })();
  }, [accessToken, getAccessToken]);

  const value = {
    createProblem,
    updateCreateProblem,
    availableLanguages,
  };

  return (
    <CreateProblemContext.Provider value={value}>
      {children}
    </CreateProblemContext.Provider>
  );
}

export function useCreateProblemContext() {
  const context = useContext(CreateProblemContext);

  if (!context) {
    throw new Error(
      "useCreateProblemContext must be used within a CreateProblemProvider"
    );
  }

  return context;
}
