"use client";

import { Editor, Tab } from "@/components/editor/editor";
import { CodeXml, FileText } from "lucide-react";
import ProblemCodeEditorLanguageSelect from "./problem-editor-language-select/problem-editor-language-select";
import ProblemQuestion from "../problem-question/problem-question";
import { CodeEditor } from "@/components/code-editor/code-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { problemEditorStore } from "../state/problem-editor-store-old";

export default function ProblemEditor() {
  const setup = problemEditorStore((s) => s.setup);
  const problem = problemEditorStore((s) => s.problem);
  const code = problemEditorStore((s) => s.code);
  const currentVersion = problemEditorStore((s) => s.currentVersion);

  const setCode = problemEditorStore((s) => s.setCode);
  const setCurrentVersion = problemEditorStore((s) => s.setCurrentVersion);

  if (!setup || !problem) {
    return (
      <div className="h-full p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const currentLanguage =
    currentVersion && Array.isArray(problem.availableLanguages)
      ? problem.availableLanguages.find((lang) =>
          lang.versions.some((v) => v.id === currentVersion.id)
        )
      : null;

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
                availableLanguages={problem.availableLanguages}
                currentVersion={currentVersion}
                changeCurrentVersion={setCurrentVersion}
              />
            </div>
            <CodeEditor
              code={code}
              changeCode={setCode}
              className="h-full overflow-auto"
              language={problem.availableLanguages.find((lang) => lang.versions.find((v) => v.id === currentVersion?.id))}
            />
          </>
        ),
      },
      {
        direction: "vertical",
        defaultSize: 45,
        children: [
          {
            component: <ProblemQuestion problem={problem} />,
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
