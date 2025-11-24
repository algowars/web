"use client";

import { Editor, Tab } from "@/components/editor/editor";
import { CodeXml, FileText } from "lucide-react";
import ProblemCodeEditorLanguageSelect from "./problem-editor-language-select/problem-editor-language-select";
import ProblemQuestion from "../problem-question/problem-question";
import { CodeEditor } from "@/components/code-editor/code-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { useProblemEditorStore } from "../state/problem-editor-store";

export default function ProblemEditor() {
  const setup = useProblemEditorStore((s) => s.setup);
  const problem = useProblemEditorStore((s) => s.problem);
  const code = useProblemEditorStore((s) => s.code);
  const currentVersion = useProblemEditorStore((s) => s.currentVersion);
  const setCode = useProblemEditorStore((s) => s.setCode);
  const setCurrentVersion = useProblemEditorStore((s) => s.setCurrentVersion);
  const getResolveLanguage = useProblemEditorStore((s) => s.getResolveLanguage);

  if (!setup || !problem) {
    return (
      <div className="h-full p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const currentLanguage = getResolveLanguage();

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
              language={currentLanguage}
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
