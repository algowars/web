import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateProblemSetup } from "../models/create-problem-setup-model";
import { useCreateProblemStore } from "../create-problem-store";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CreateProblemSetupCardInfo from "./create-problem-setup-card-info";

type CreateProblemSetupCardProps = {
  setup: CreateProblemSetup;
  index: number;
};

export default function CreateProblemSetupCard({
  setup,
  index,
}: CreateProblemSetupCardProps) {
  const getLanguageByVersionId = useCreateProblemStore(
    (s) => s.getLanguageByVersionId
  );
  const getLanguageVersionById = useCreateProblemStore(
    (s) => s.getLanguageVersionById
  );
  const removeSetup = useCreateProblemStore((s) => s.removeSetup);

  const language = setup.languageVersionIds.length
    ? getLanguageByVersionId(setup.languageVersionIds[0])
    : null;

  const languageVersion = setup.languageVersionIds.length
    ? getLanguageVersionById(setup.languageVersionIds[0])
    : null;

  if (!language || !languageVersion) {
    return (
      <Card>
        <CardHeader>Unknown Language</CardHeader>
      </Card>
    );
  }

  return (
    <Card className="pb-2">
      <CardHeader className="flex items-start">
        <div className="flex flex-col gap-2">
          <CardTitle>Language Name: {language.name}</CardTitle>
          <CardDescription>{languageVersion.version}</CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="ml-auto">
              <Trash />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete setup?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => removeSetup(index)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <CreateProblemSetupCardInfo />
      </CardContent>
    </Card>
  );
}
