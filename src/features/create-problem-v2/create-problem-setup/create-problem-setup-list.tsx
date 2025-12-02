import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreateProblemStore } from "../create-problem-store";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Language } from "@/features/problems/models/language";
import { getLanguageIconClass } from "@/features/language/get-language-icon";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateProblemSetupInfo from "./create-problem-setup-info";

function LanguageIcons({ languages }: { languages: Language[] }) {
  return (
    <div className="flex gap-2">
      {languages.map((language) => {
        const cls = getLanguageIconClass(language.name);

        return (
          <div key={language.id} className="flex items-center justify-center">
            <i className={`${cls} text-xl`} />
          </div>
        );
      })}
    </div>
  );
}

export default function CreateProblemSetupList() {
  const setups = useCreateProblemStore((s) => s.setups);
  const removeSetup = useCreateProblemStore((s) => s.removeSetup);
  const getLanguagesByVersionIds = useCreateProblemStore(
    (s) => s.getLanguagesByVersionIds
  );
  const getLanguageVersionsByIds = useCreateProblemStore(
    (s) => s.getLanguageVersionsByIds
  );

  return (
    <Table>
      <TableCaption>Problem Setups</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead>Index</TableHead>
          <TableHead>Languages</TableHead>
          <TableHead>Versions</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {setups.map((setup, i) => {
          const rowKey = setup.languageVersionIds.join("-");
          const versions = getLanguageVersionsByIds(setup.languageVersionIds);
          return (
            <TableRow key={rowKey}>
              <Dialog>
                <DialogTrigger asChild>
                  <TableCell className="cursor-pointer hover:text-blue-600">
                    {i + 1}
                  </TableCell>
                </DialogTrigger>

                <DialogTrigger asChild>
                  <TableCell className="cursor-pointer hover:text-blue-600">
                    <LanguageIcons
                      languages={getLanguagesByVersionIds(
                        setup.languageVersionIds
                      )}
                    />
                  </TableCell>
                </DialogTrigger>

                <DialogTrigger asChild>
                  <TableCell className="cursor-pointer hover:text-blue-600">
                    {versions.map((v) => v.version).join(", ")}
                  </TableCell>
                </DialogTrigger>

                <DialogContent className="max-w-7xl">
                  <DialogHeader>
                    <DialogTitle>Setup Details</DialogTitle>
                  </DialogHeader>
                  <CreateProblemSetupInfo setup={setup} />
                </DialogContent>
              </Dialog>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash className="size-4" />
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
                      <AlertDialogAction onClick={() => removeSetup(i)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
