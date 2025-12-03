"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";
import { useCreateProblemStore } from "../create-problem-store";
import { CreateProblemTestSuiteModel } from "../models/create-problem-test-suite-model";

type CreateProblemSetupTestSuiteSheetProps = React.ComponentProps<
  typeof SheetPrimitive.Root
> & {
  buttonClassName?: string;
};

export default function CreateProblemSetupTestSuiteSheet({
  buttonClassName,
  ...props
}: CreateProblemSetupTestSuiteSheetProps) {
  const addSetupTestSuite = useCreateProblemStore((s) => s.addSetupTestSuite);
  const [createTestSuite, setCreateTestSuite] =
    useState<CreateProblemTestSuiteModel>({ type: "public" });

  return (
    <Sheet {...props}>
      <SheetTrigger asChild>
        <Button className={buttonClassName}>Add Test Suite</Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create a test suite</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-5 px-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={(t) => {
                setCreateTestSuite((curr) => ({
                  ...curr,
                  type: t as "public" | "private",
                }));
              }}
              value={createTestSuite.type}
            >
              <SelectTrigger className="w-full" id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={() => addSetupTestSuite(createTestSuite)}>
              Save Test Suite
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="secondary">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
