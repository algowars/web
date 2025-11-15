"use client";

import { Editor, Tab } from "@/components/editor/editor";
import { CodeXml, FileText } from "lucide-react";
import ProblemCodeEditorLanguageSelect from "./problem-editor-language-select/problem-editor-language-select";
import ProblemQuestion from "../problem-question/problem-question";
import { CodeEditor } from "@/components/code-editor/code-editor";
import { useProblemEditor } from "../state/problem-editor-store";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProblemEditor() {
  const setup = useProblemEditor((s) => s.setup);
  const problem = useProblemEditor((s) => s.problem);
  const code = useProblemEditor((s) => s.code);
  const currentVersion = useProblemEditor((s) => s.currentVersion);

  const setCode = useProblemEditor((s) => s.setCode);
  const setCurrentVersion = useProblemEditor((s) => s.setCurrentVersion);

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
    currentVersion &&
    setup.availableLanguages.find((lang) =>
      lang.versions.some((v) => v.id === currentVersion.id)
    );

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
                availableLanguages={setup.availableLanguages}
                currentVersion={currentVersion}
                changeCurrentVersion={setCurrentVersion}
              />
            </div>
            <CodeEditor
              code={code}
              changeCode={setCode}
              className="h-full overflow-auto"
              language={currentLanguage ?? setup.availableLanguages[0]}
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
