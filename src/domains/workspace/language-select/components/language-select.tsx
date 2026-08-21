import { ProgrammingLanguage } from "@/domains/language/models/programming-language";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { useEffect, useMemo } from "react";

type LanguageSelectProps = {
  languages: ProgrammingLanguage[];
  /** Currently selected language version ID. Store-agnostic — callers own
   *  where this lives (redux, zustand, etc.) and pass it down. */
  selectedVersionId: string | null;
  /** Called whenever the selected version should change, either because the
   *  user picked a different language (first version of that language) or a
   *  different version directly. */
  onSelectVersion: (versionId: string | null) => void;
} & Omit<React.HTMLAttributes<HTMLUListElement>, "onSelect">;

export const LanguageSelect = ({
  languages,
  selectedVersionId,
  onSelectVersion,
  ...props
}: LanguageSelectProps) => {
  const selectedLanguage = useMemo(
    () =>
      languages.find((l) =>
        l.versions.some((v) => v.id === selectedVersionId)
      ) ?? languages[0],
    [languages, selectedVersionId]
  );

  const selectLanguage = (languageId: string) => {
    const language = languages.find((l) => l.id === languageId);
    onSelectVersion(language?.versions[0]?.id ?? null);
  };

  const defaultVersionId = languages[0]?.versions[0]?.id;

  useEffect(() => {
    // Only auto-select the default if there's no version currently selected OR
    // the selected version isn't valid for this problem's available languages.
    // Without the second check, the component fires onSelectVersion on every
    // render where languages first become non-empty (e.g. after game load),
    // which triggers a redundant getProblemSetup call that previously wiped code.
    const isCurrentVersionValid =
      !!selectedVersionId &&
      languages.some((l) => l.versions.some((v) => v.id === selectedVersionId));

    if (!isCurrentVersionValid && defaultVersionId) {
      onSelectVersion(defaultVersionId);
    }
  }, [defaultVersionId, onSelectVersion, selectedVersionId, languages]);

  return (
    <ul {...props} className={cn("flex items-center gap-2", props.className)}>
      <li>
        <Select
          value={selectedLanguage?.id ?? ""}
          onValueChange={selectLanguage}
          disabled={languages.length === 0}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              {languages.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </li>
      <li>
        <Select
          value={selectedVersionId ?? ""}
          onValueChange={(val) => onSelectVersion(val)}
          disabled={!selectedLanguage || selectedLanguage.versions.length === 0}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select a version" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              {selectedLanguage?.versions.map((version) => (
                <SelectItem key={version.id} value={version.id}>
                  {version.version}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </li>
    </ul>
  );
};
