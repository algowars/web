"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ProblemSetup } from "../problems/models/problem-setup";
import { Language, LanguageVersion } from "../problems/models/language";
import { useProblem } from "../problems/api/get-problem";

interface ApiError {
  status?: number;
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

interface ProblemContextType {
  problemSetup: ProblemSetup | null;
  isLoading: boolean;
  error: { status: number; message: string } | null;

  preferredLanguageId: number;
  currentLanguage: Language | null;
  currentVersion: LanguageVersion | null;

  code: string;

  changePreferredLanguage: (languageId: number) => void;
  changeCurrentVersion: (versionId: number) => void;
  changeCode: (newCode: string) => void;
  refetchProblem: () => void;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

interface ProblemProviderProps {
  children: ReactNode;
  slug: string;
  defaultPreferredLanguageId?: number;
}

export function ProblemProvider({
  children,
  slug,
  defaultPreferredLanguageId = 1,
}: ProblemProviderProps) {
  const [preferredLanguageId, setPreferredLanguageId] = useState(
    defaultPreferredLanguageId
  );
  const [currentVersionId, setCurrentVersionId] = useState<number>(0);
  const [code, setCode] = useState("");

  const {
    data: problemSetup,
    isLoading,
    error: rawError,
    refetch,
  } = useProblem({
    slug,
    preferredLanguageId,
  });

  const error = rawError
    ? {
        status:
          (rawError as ApiError)?.response?.status ||
          (rawError as ApiError)?.status ||
          500,
        message:
          (rawError as ApiError)?.response?.data?.message ||
          (rawError as ApiError)?.message ||
          "An error occurred",
      }
    : null;

  const currentLanguage: Language | null =
    problemSetup?.availableLanguages?.find(
      (lang) => lang.id === preferredLanguageId
    ) ||
    problemSetup?.availableLanguages?.[0] ||
    null;

  const currentVersion: LanguageVersion | null =
    currentLanguage?.versions?.find(
      (version) => version.id === currentVersionId
    ) ||
    currentLanguage?.versions?.[0] ||
    null;

  useEffect(() => {
    if (problemSetup?.initialCode) {
      setCode(problemSetup.initialCode);
    }
  }, [problemSetup?.initialCode, preferredLanguageId]);

  useEffect(() => {
    if (currentLanguage?.versions?.length) {
      setCurrentVersionId(currentLanguage.versions[0].id);
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (problemSetup?.availableLanguages?.length && !currentLanguage) {
      const defaultLang =
        problemSetup.availableLanguages.find(
          (lang) => lang.id === problemSetup.defaultLanguageId
        ) || problemSetup.availableLanguages[0];

      setPreferredLanguageId(defaultLang.id);
    }
  }, [problemSetup, currentLanguage]);

  const changePreferredLanguage = (languageId: number) => {
    const foundLanguage = problemSetup?.availableLanguages?.find(
      (lang) => lang.id === languageId
    );

    if (foundLanguage) {
      setPreferredLanguageId(languageId);
      setCurrentVersionId(foundLanguage.versions[0]?.id || 0);
    }
  };

  const changeCurrentVersion = (versionId: number) => {
    setCurrentVersionId(versionId);
  };

  const changeCode = (newCode: string) => {
    setCode(newCode);
  };

  const refetchProblem = () => {
    refetch();
  };

  const contextValue: ProblemContextType = {
    problemSetup: problemSetup || null,
    isLoading,
    error,
    preferredLanguageId,
    currentLanguage,
    currentVersion,
    code,
    changePreferredLanguage,
    changeCurrentVersion,
    changeCode,
    refetchProblem,
  };

  return (
    <ProblemContext.Provider value={contextValue}>
      {children}
    </ProblemContext.Provider>
  );
}

export function useProblemContext() {
  const context = useContext(ProblemContext);
  if (context === undefined) {
    throw new Error("useProblemContext must be used within a ProblemProvider");
  }
  return context;
}

export function useProblemData() {
  const { problemSetup, isLoading, error } = useProblemContext();
  return { problemSetup, isLoading, error };
}

export function useProblemLanguage() {
  const {
    preferredLanguageId,
    currentLanguage,
    currentVersion,
    changePreferredLanguage,
    changeCurrentVersion,
  } = useProblemContext();

  return {
    preferredLanguageId,
    currentLanguage,
    currentVersion,
    changePreferredLanguage,
    changeCurrentVersion,
  };
}

export function useProblemCode() {
  const { code, changeCode } = useProblemContext();
  return { code, changeCode };
}
