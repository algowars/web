import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Language, LanguageVersion } from "@/features/problems/models/language";

type Props = {
  availableLanguages: Language[];
  currentLanguage: Language | null;
  currentVersion: LanguageVersion | null;
  changeCurrentLanguage: (languageId: number) => void;
  changeCurrentVersion: (versionId: number) => void;
};

export default function ProblemCodeEditorLanguageSelect({
  availableLanguages,
  currentLanguage,
  currentVersion,
  changeCurrentLanguage,
  changeCurrentVersion,
}: Props) {
  return (
    <ul className="ml-auto flex items-center gap-2">
      <li>
        <Select
          value={currentLanguage ? `${currentLanguage.id}` : undefined}
          onValueChange={(v: string) => changeCurrentLanguage(parseInt(v))}
        >
          <SelectTrigger className="h-6 min-w-[6rem] text-xs px-2 py-1">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent className="min-w-[6rem]">
            <SelectGroup>
              <SelectLabel className="text-xs py-1 px-2">Languages</SelectLabel>
              {availableLanguages?.map((lang) => (
                <SelectItem
                  value={`${lang.id}`}
                  key={lang.id}
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
          value={currentVersion ? `${currentVersion.id}` : undefined}
          onValueChange={(v: string) => changeCurrentVersion(parseInt(v))}
          disabled={!currentLanguage?.versions?.length}
        >
          <SelectTrigger className="h-6 min-w-[8rem] text-xs px-2 py-1">
            <SelectValue placeholder="Select a version" />
          </SelectTrigger>
          <SelectContent className="min-w-[8rem]">
            <SelectGroup>
              <SelectLabel className="text-xs py-1 px-2">Versions</SelectLabel>
              {currentLanguage?.versions?.map((version) => (
                <SelectItem
                  value={`${version.id}`}
                  key={version.id}
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
