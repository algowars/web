import {
  ProgrammingLanguage,
  ProgrammingLanguageVersion,
} from "@/domains/language/models/programming-language";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { useWorkspaceStore } from "../../state/workspace-store";
import { useMemo } from "react";

type LanguageSelectProps = {
  languages: ProgrammingLanguage[];
  selectedVersion?: ProgrammingLanguageVersion;
} & React.HTMLAttributes<HTMLUListElement>;

export const LanguageSelect = ({
  languages,
  selectedVersion,
  ...props
}: LanguageSelectProps) => {
  const setSelectedVersionId = useWorkspaceStore(
    (state) => state.setSelectedVersionId
  );
  const selectedVersionId = useWorkspaceStore(
    (state) => state.selectedVersionId
  );
  const selectedLanguage = useMemo(
    () =>
      languages.find((l) =>
        l.versions.some((v) => v.id === selectedVersionId)
      ) ?? null,
    [languages, selectedVersionId]
  );

  const selectLanguage = (languageId: string) => {
    const language = languages.find((l) => l.id === languageId);
    setSelectedVersionId(language?.versions[0]?.id ?? null);
  };

  return (
    <ul {...props} className={cn("flex items-center gap-2", props.className)}>
      <li>
        <Select
          value={selectedLanguage?.id ?? ""}
          onValueChange={selectLanguage}
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
          onValueChange={setSelectedVersionId}
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
