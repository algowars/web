"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useProblemEditorStore } from "../../problem-editor-store";

export default function ProblemCodeEditorLanguageSelect({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  const changeCurrentVersion = useProblemEditorStore(
    (s) => s.changeCurrentVersion
  );
  const language = useProblemEditorStore((s) => s.getLanguage());
  const languageVersion = useProblemEditorStore((s) => s.getLanguageVersion());
  const availableLanguages = useProblemEditorStore((s) =>
    s.getAvailableLanguages()
  );
  const findVersionById = useProblemEditorStore((s) => s.findVersionById);

  return (
    <ul {...props} className={cn("ml-auto flex items-center gap-2", className)}>
      <li>
        <Select
          value={language?.id.toString() ?? ""}
          onValueChange={(value: string) => {
            changeCurrentVersion(
              availableLanguages.find((l) => l.id === Number(value))
                ?.versions[0]
            );
          }}
        >
          <SelectTrigger
            className="h-6 min-w-[6rem] text-xs px-2 py-1"
            data-testid="language-select"
          >
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>

          <SelectContent className="min-w-[6rem]">
            <SelectGroup>
              <SelectLabel className="text-xs py-1 px-2">Languages</SelectLabel>

              {availableLanguages.map((lang) => (
                <SelectItem
                  value={lang.id.toString()}
                  key={lang.id}
                  data-testid={`language-option-${lang.name}`}
                  className="text-xs py-1 px-2 min-h-[1.5rem]"
                >
                  {lang.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </li>

      <li>
        <Select
          value={languageVersion?.id.toString() ?? ""}
          disabled={!language?.versions?.length}
          onValueChange={(value: string) =>
            changeCurrentVersion(findVersionById(Number(value)))
          }
        >
          <SelectTrigger
            className="h-6 min-w-[8rem] text-xs px-2 py-1"
            data-testid="version-select"
          >
            <SelectValue placeholder="Select a version" />
          </SelectTrigger>

          <SelectContent className="min-w-[8rem]">
            <SelectGroup>
              <SelectLabel className="text-xs py-1 px-2">Versions</SelectLabel>

              {language?.versions.map((version) => (
                <SelectItem
                  value={version.id.toString()}
                  key={version.id}
                  data-testid={`version-option-${version.version}`}
                  className="text-xs py-1 px-2 min-h-[1.5rem]"
                >
                  {version.version}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </li>
    </ul>
  );
}
