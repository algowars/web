"use client";

import { Editor, Tab } from "@/components/editor/editor";
import { CodeXml, FileText } from "lucide-react";
import ProblemCodeEditorLanguageSelect from "./problem-editor-language-select/problem-editor-language-select";
import ProblemQuestion from "../problem-question/problem-question";
import { CodeEditor } from "@/components/code-editor/code-editor";
import { useProblemContext } from "../problem-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ProblemEditor() {
  const {
    problemSetup,
    isLoading,
    error,
    currentLanguage,
    currentVersion,
    code,
    changePreferredLanguage,
    changeCurrentVersion,
    changeCode,
  } = useProblemContext();

  if (isLoading) {
    return (
      <div className="h-full p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !problemSetup) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load problem: {error?.message || "Problem not found"}
        </AlertDescription>
      </Alert>
    );
  }

  const tabs: Tab = {
    direction: "horizontal",
    children: [
      {
        name: "Code",
        key: "code",
        defaultSize: 55,
        icon: (
          <CodeXml size={16} className="text-green-600 dark:text-green-400" />
        ),
        component: (
          <>
            <div className="px-1 py-1">
              <ProblemCodeEditorLanguageSelect
                availableLanguages={problemSetup.languages}
                currentLanguage={currentLanguage}
                currentVersion={currentVersion}
                changeCurrentLanguage={changePreferredLanguage}
                changeCurrentVersion={changeCurrentVersion}
              />
            </div>
            <CodeEditor
              code={code}
              changeCode={changeCode}
              className="h-full overflow-auto"
            />
          </>
        ),
      },
      {
        direction: "vertical",
        defaultSize: 45,
        children: [
          {
            component: <ProblemQuestion problem={problemSetup.problem} />,
            key: "description",
            name: "Description",
            defaultSize: 70,
            icon: (
              <FileText
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
            ),
          },
        ],
      },
    ],
  };

  return <Editor tabs={tabs} />;
}
