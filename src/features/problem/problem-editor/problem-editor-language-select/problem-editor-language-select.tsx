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

type Props = {
  availableLanguages: {
    id: number;
    name: string;
    versions: {
      versionId: number;
      name: string;
    }[];
  }[];
  currentLanguage: {
    id: number;
    name: string;
    versions: {
      versionId: number;
      name: string;
    }[];
  };
  currentLanguageVersionId: number;
  changeCurrentLanguage: (languageId: number) => void;
  changeCurrentLanguageVersion: (versionId: number) => void;
};

export default function ProblemCodeEditorLanguageSelect({
  availableLanguages,
  currentLanguage,
  currentLanguageVersionId,
  changeCurrentLanguage,
  changeCurrentLanguageVersion,
}: Props) {
  return (
    <ul className="ml-auto flex items-center gap-3">
      <li>
        <Select
          value={`${currentLanguage.id}`}
          onValueChange={(v: string) => changeCurrentLanguage(parseInt(v))}
        >
          <SelectTrigger className="h-7 min-w-[8rem] text-sm">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              {availableLanguages.map((lang) => (
                <SelectItem value={`${lang.id}`} key={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </li>
      <li>
        <Select
          value={`${currentLanguageVersionId}`}
          onValueChange={(v: string) =>
            changeCurrentLanguageVersion(parseInt(v))
          }
        >
          <SelectTrigger className="h-7 min-w-[10rem]">
            <SelectValue placeholder="Select a version" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Versions</SelectLabel>
              {currentLanguage.versions.map((version) => (
                <SelectItem
                  value={`${version.versionId}`}
                  key={version.versionId}
                >
                  {version.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </li>
    </ul>
  );
}
