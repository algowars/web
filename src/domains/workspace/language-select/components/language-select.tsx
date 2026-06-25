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

type LanguageSelectProps = {
  languages: ProgrammingLanguage[];
  selectedVersion?: ProgrammingLanguageVersion;
} & React.HTMLAttributes<HTMLUListElement>;

export const LanguageSelect = ({
  languages,
  selectedVersion,
  ...props
}: LanguageSelectProps) => {
  return (
    <ul {...props} className={cn("flex items-center gap-2", props.className)}>
      <li>
        <Select>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
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
    </ul>
  );
};
