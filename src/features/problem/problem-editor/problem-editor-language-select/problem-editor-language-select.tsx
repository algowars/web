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
import React from "react";
import { Language, LanguageVersion } from "@/features/problems/models/language";

type Props = {
  availableLanguages: Language[];
  currentVersion: LanguageVersion | null;
  changeCurrentVersion: (version: LanguageVersion | null) => void;
};

export default function ProblemCodeEditorLanguageSelect({
  availableLanguages,
  currentVersion,
  changeCurrentVersion,
}: Props) {
  const currentLanguage =
    currentVersion &&
    availableLanguages.find((lang) =>
      lang.versions.some((v) => v.id === currentVersion.id)
    );

  return (
    <ul className="ml-auto flex items-center gap-2">
      <li>
        <Select
          value={currentLanguage?.id.toString()}
          onValueChange={(v: string) => {
            const lang = availableLanguages.find((l) => l.id === parseInt(v));
            // Select first version of the chosen language
            changeCurrentVersion(lang?.versions[0] ?? null);
          }}
        >
          <SelectTrigger className="h-6 min-w-[6rem] text-xs px-2 py-1">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent className="min-w-[6rem]">
            <SelectGroup>
              <SelectLabel className="text-xs py-1 px-2">Languages</SelectLabel>
              {availableLanguages.map((lang) => (
                <SelectItem
                  value={lang.id.toString()}
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
          value={currentVersion?.id.toString()}
          onValueChange={(v: string) =>
            changeCurrentVersion(
              currentLanguage?.versions.find((ver) => ver.id === parseInt(v)) ??
                null
            )
          }
          disabled={!currentLanguage?.versions?.length}
        >
          <SelectTrigger className="h-6 min-w-[8rem] text-xs px-2 py-1">
            <SelectValue placeholder="Select a version" />
          </SelectTrigger>
          <SelectContent className="min-w-[8rem]">
            <SelectGroup>
              <SelectLabel className="text-xs py-1 px-2">Versions</SelectLabel>
              {currentLanguage?.versions.map((version) => (
                <SelectItem
                  value={version.id.toString()}
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
