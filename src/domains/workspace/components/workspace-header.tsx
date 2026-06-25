import { Problem } from "@/domains/problem/models/problem";
import { LanguageSelect } from "../language-select/components/language-select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { ClipboardList, Menu } from "lucide-react";
import Link from "next/link";
import { routerConfig } from "@/shared/router-config";

type WorkspaceHeaderProps = {
  problem: Problem;
};

export const WorkspaceHeader = ({ problem }: WorkspaceHeaderProps) => {
  return (
    <div className="p-1 flex flex-1 items-center">
      <ul className="ml-auto hidden md:flex">
        <li>
          <Button className="w-24" data-cy="submit-btn">
            Submit
          </Button>
        </li>
        <li>
          <Button variant="ghost" asChild>
            <Link
              href={routerConfig.problemSubmissions.execute({
                slug: problem.slug,
              })}
            >
              View Submissions
            </Link>
          </Button>
        </li>
      </ul>
      <LanguageSelect
        languages={problem.availableLanguages ?? []}
        className="ml-auto hidden md:flex"
      />

      <Button className="ml-auto w-24 md:hidden">Submit</Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="ml-1 -mr-1 md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>{problem.title}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 flex-1 px-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Language
              </span>
              <div className="flex flex-wrap gap-2">
                <LanguageSelect
                  languages={problem.availableLanguages ?? []}
                  className="flex-1 min-w-0"
                />
              </div>
            </div>

            <Separator />

            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href={`/problems/${problem.slug}/submissions`}>
                <ClipboardList size={16} />
                View Submissions
              </Link>
            </Button>
          </div>

          <SheetFooter className="px-4 pb-4">
            <Button className="w-full" data-cy="submit-btn">
              Submit
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
