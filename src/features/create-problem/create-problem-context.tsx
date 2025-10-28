"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";

type CreateProblemState = {
  title: string;
  question: string;
  tags: string[];
  slug: string;
};

type CreateProblemContextType = {
  createProblem: CreateProblemState;
  setCreateProblem: React.Dispatch<React.SetStateAction<CreateProblemState>>;
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

  return (
    <CreateProblemContext.Provider
      value={{ createProblem, setCreateProblem, updateCreateProblem }}
    >
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
