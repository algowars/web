"use client";

import { Editor, Tab } from "@/components/editor/editor";
import { CodeXml, FileText } from "lucide-react";
import ProblemCodeEditorLanguageSelect from "./problem-editor-language-select/problem-editor-language-select";
import ProblemQuestion from "../problem-question/problem-question";
import { CodeEditor } from "@/components/code-editor/code-editor";
import { useState } from "react";
import { Problem } from "@/features/problems/models/problem";

const languages = [
  {
    id: 93,
    name: "JavaScript",
    versions: [
      {
        versionId: 93,
        name: "(Node.js 18.15.0)",
      },
      {
        versionId: 97,
        name: "(Node.js 20.17.0)",
      },
      {
        versionId: 102,
        name: "(Node.js 22.08.0",
      },
    ],
  },
  {
    id: 70,
    name: "Python",
    versions: [
      {
        versionId: 70,
        name: "(2.7.17)",
      },
      {
        versionId: 100,
        name: "(3.11.2)",
      },
    ],
  },
  {
    id: 105,
    name: "C++",
    versions: [
      {
        versionId: 105,
        name: "(GCC 14.1.0)",
      },
    ],
  },
];

type ProblemEditorProps = {
  className?: string;
  slug: string;
};

export default function ProblemEditor({ slug }: ProblemEditorProps) {
  const problem: Problem = {
    id: "123",
    title: "Test question",
    slug: slug,
    question: "TEST QUESTION",
    tags: ["banana", "chicken"],
    difficulty: {
      name: "Hard",
      rating: 2000,
    },
  };

  const [code, setCode] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState({
    id: 93,
    name: "JavaScript",
    versions: [
      {
        versionId: 93,
        name: "(Node.js 18.15.0)",
      },
      {
        versionId: 97,
        name: "(Node.js 20.17.0)",
      },
      {
        versionId: 102,
        name: "(Node.js 22.08.0",
      },
    ],
  });
  const [currentLanguageVersionId, setCurrentLanguageVersionId] =
    useState<number>(93);

  const changeCode = (value: string) => {
    setCode(value);
  };

  const changeCurrentLanguage = (languageId: number) => {
    const foundLanguage = languages.find((lan) => lan.id === languageId);

    if (foundLanguage) {
      setSelectedLanguages(foundLanguage);
      setCurrentLanguageVersionId(foundLanguage.versions[0]?.versionId ?? 0);
    }
  };

  const changeCurrentLanguageVersion = (versionId: number) => {
    setCurrentLanguageVersionId(versionId);
  };

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
                availableLanguages={languages}
                currentLanguage={selectedLanguages}
                currentLanguageVersionId={currentLanguageVersionId}
                changeCurrentLanguage={changeCurrentLanguage}
                changeCurrentLanguageVersion={changeCurrentLanguageVersion}
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
            component: <ProblemQuestion problem={problem ?? null} />,
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
