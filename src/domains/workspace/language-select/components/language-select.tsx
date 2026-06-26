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
import { useEffect, useMemo } from "react";

type LanguageSelectProps = {
  languages: ProgrammingLanguage[];
} & React.HTMLAttributes<HTMLUListElement>;

export const LanguageSelect = ({
  languages,
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
      ) ?? languages[0],
    [languages, selectedVersionId]
  );

  const selectLanguage = (languageId: string) => {
    const language = languages.find((l) => l.id === languageId);
    setSelectedVersionId(language?.versions[0]?.id ?? null);
  };

  const defaultVersionId = languages[0]?.versions[0]?.id;

  useEffect(() => {
    if (!selectedVersionId && defaultVersionId) {
      setSelectedVersionId(defaultVersionId);
    }
  }, [defaultVersionId, selectedVersionId, setSelectedVersionId]);

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
          onValueChange={(val) => setSelectedVersionId(val)}
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
