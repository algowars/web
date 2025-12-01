import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderCode } from "lucide-react";
import CreateProblemSetupSheet from "./create-problem-setup-sheet";
import { useCreateProblemStore } from "../create-problem-store";
import CreateProblemSetupList from "./create-problem-setup-list";

export function CreateProblemSetup() {
  const setups = useCreateProblemStore((s) => s.setups);

  return (
    <Card>
      <CardHeader className="flex items-start">
        <div>
          <CardTitle>Setups</CardTitle>
          <CardDescription>Minimum of 1 setup is required.</CardDescription>
        </div>
        {!!setups.length && (
          <CreateProblemSetupSheet buttonClassName="ml-auto" />
        )}
      </CardHeader>
      <CardContent>
        {!setups.length ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderCode />
              </EmptyMedia>
              <EmptyTitle>No Setups Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t added any setups. Setups are used to define the
                programming environments for different languages.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <CreateProblemSetupSheet />
              </div>
            </EmptyContent>
          </Empty>
        ) : (
          <CreateProblemSetupList />
        )}
      </CardContent>
    </Card>
  );
}
