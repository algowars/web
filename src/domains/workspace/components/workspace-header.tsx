"use client";
import {
  selectIsAuthenticated,
  selectUserPermissions,
} from "@/domains/user/state/user-slice";
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
import { ClipboardList, Lock, Menu } from "lucide-react";
import Link from "next/link";
import { routerConfig } from "@/shared/router-config";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { WorkspaceEvents } from "../state/workspace-events";
import { selectIsSubmittingSubmission } from "../state/workspace-slice";
import { ModeToggle } from "@/shared/theme/mode-toggle";

type WorkspaceHeaderProps = {
  problem: Problem;
};

export const WorkspaceHeader = ({ problem }: WorkspaceHeaderProps) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isSubmittingSubmission = useAppSelector(selectIsSubmittingSubmission);
  const userPermissions = useAppSelector(selectUserPermissions);

  const canRunCode = userPermissions.includes("submission:create");

  const runLabel = isSubmittingSubmission ? "Running..." : "Run";
  const submitLabel = isSubmittingSubmission ? "Submitting..." : "Submit";
  return (
    <div className="p-1 flex flex-1 items-center">
      <div className="hidden md:grid md:flex-1 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div />
        <ul className="flex justify-center gap-1">
          <li>
            <Button
              className="w-24"
              data-cy="run-btn"
              variant="secondary"
              disabled={
                !isAuthenticated || isSubmittingSubmission || !canRunCode
              }
              onClick={() => dispatch(WorkspaceEvents.runCodeRequested())}
            >
              {!isAuthenticated ? <Lock /> : null} {runLabel}
            </Button>
          </li>
          <li>
            <Button
              className="w-24"
              data-cy="submit-btn"
              disabled={
                !isAuthenticated || isSubmittingSubmission || !canRunCode
              }
              onClick={() => dispatch(WorkspaceEvents.submitCodeRequested())}
            >
              {!isAuthenticated ? <Lock /> : null} {submitLabel}
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
        <div className="justify-self-end flex items-center gap-2">
          <LanguageSelect languages={problem.availableLanguages ?? []} />
          <ModeToggle />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1 md:hidden">
        <Button
          className="w-20"
          data-cy="run-btn"
          variant="secondary"
          disabled={!isAuthenticated || isSubmittingSubmission || !canRunCode}
          onClick={() => dispatch(WorkspaceEvents.runCodeRequested())}
        >
          {!isAuthenticated ? <Lock /> : null} {runLabel}
        </Button>
        <Button
          className="w-24"
          data-cy="submit-btn"
          disabled={!isAuthenticated || isSubmittingSubmission || !canRunCode}
          onClick={() => dispatch(WorkspaceEvents.submitCodeRequested())}
        >
          {!isAuthenticated ? <Lock /> : null} {submitLabel}
        </Button>
      </div>
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
            <div className="grid w-full grid-cols-2 gap-2">
              <Button
                variant="outline"
                data-cy="run-btn"
                disabled={
                  !isAuthenticated || isSubmittingSubmission || !canRunCode
                }
                onClick={() => dispatch(WorkspaceEvents.runCodeRequested())}
              >
                {!isAuthenticated ? <Lock /> : null} {runLabel}
              </Button>
              <Button
                data-cy="submit-btn"
                disabled={
                  !isAuthenticated || isSubmittingSubmission || !canRunCode
                }
                onClick={() => dispatch(WorkspaceEvents.submitCodeRequested())}
              >
                {!isAuthenticated ? <Lock /> : null} {submitLabel}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
