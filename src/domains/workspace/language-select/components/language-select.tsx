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
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { WorkspaceEvents } from "../../state/workspace-events";
import { selectSelectedVersionId } from "../../state/workspace-slice";

type LanguageSelectProps = {
  languages: ProgrammingLanguage[];
} & React.HTMLAttributes<HTMLUListElement>;

export const LanguageSelect = ({
  languages,
  ...props
}: LanguageSelectProps) => {
  const dispatch = useAppDispatch();
  const selectedVersionId = useAppSelector(selectSelectedVersionId);

  const selectedLanguage = useMemo(
    () =>
      languages.find((l) =>
        l.versions.some((v) => v.id === selectedVersionId)
      ) ?? languages[0],
    [languages, selectedVersionId]
  );

  const selectLanguage = (languageId: string) => {
    const language = languages.find((l) => l.id === languageId);
    dispatch(
      WorkspaceEvents.selectedVersionChanged(language?.versions[0]?.id ?? null)
    );
  };

  const defaultVersionId = languages[0]?.versions[0]?.id;

  useEffect(() => {
    if (!selectedVersionId && defaultVersionId) {
      dispatch(WorkspaceEvents.selectedVersionChanged(defaultVersionId));
    }
  }, [defaultVersionId, dispatch, selectedVersionId]);

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
          onValueChange={(val) =>
            dispatch(WorkspaceEvents.selectedVersionChanged(val))
          }
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
