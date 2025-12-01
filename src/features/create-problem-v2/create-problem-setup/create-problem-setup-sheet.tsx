"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateProblemStore } from "../create-problem-store";
import * as SheetPrimitive from "@radix-ui/react-dialog";

type CreateProblemSetupSheetProps = React.ComponentProps<
  typeof SheetPrimitive.Root
> & {
  buttonClassName?: string;
};

export default function CreateProblemSetupSheet({
  buttonClassName,
  ...props
}: CreateProblemSetupSheetProps) {
  const availableLanguages = useCreateProblemStore((s) => s.availableLanguages);
  const addSetup = useCreateProblemStore((s) => s.addSetup);

  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(
    null
  );
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    null
  );

  const selectedLanguage = availableLanguages.find(
    (l) => l.id === selectedLanguageId
  );

  return (
    <Sheet {...props}>
      <SheetTrigger asChild>
        <Button className={buttonClassName}>Add Setup</Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create a setup</SheetTitle>
          <SheetDescription>
            Choose a language and a version to configure this setup.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label>Language</Label>
            <Select
              onValueChange={(v) => {
                setSelectedLanguageId(Number(v));
                setSelectedVersionId(null);
              }}
              value={selectedLanguageId?.toString() ?? ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>

              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id.toString()}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedLanguage && (
            <div className="grid gap-3">
              <Label>Version</Label>

              <Select
                onValueChange={(v) => setSelectedVersionId(Number(v))}
                value={selectedVersionId?.toString() ?? ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>

                <SelectContent>
                  {selectedLanguage.versions.map((ver) => (
                    <SelectItem key={ver.id} value={ver.id.toString()}>
                      {ver.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="button"
              disabled={!selectedVersionId}
              onClick={() => {
                if (!selectedLanguageId || !selectedVersionId) return;

                addSetup({
                  languageVersionIds: [selectedVersionId.toString()],
                  initialCode: "",
                  solution: "",
                });

                setSelectedLanguageId(null);
                setSelectedVersionId(null);
              }}
            >
              Save setup
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
