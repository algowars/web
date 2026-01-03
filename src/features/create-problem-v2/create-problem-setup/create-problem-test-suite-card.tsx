import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateProblemTestSuiteModel } from "../models/create-problem-test-suite-model";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useCreateProblemStore } from "../create-problem-store";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EditTestSuiteDialog } from "./edit-test-suite-dialog";

type CreateProblemTestSuiteCardProps = {
  testSuite: CreateProblemTestSuiteModel;
  setupIndex: number;
  index: number;
};

export default function CreateProblemTestSuiteCard({
  testSuite,
  setupIndex,
  index,
}: CreateProblemTestSuiteCardProps) {
  const removeSetupTestSuite = useCreateProblemStore(
    (s) => s.removeSetupTestSuite
  );

  return (
    <Card>
      <CardHeader className="flex items-start gap-3">
        <div>
          <CardTitle>Test Suite</CardTitle>
          <CardDescription>Type: {testSuite.type}</CardDescription>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="ml-auto" variant="outline">
              Edit Test Suite
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[500px] sm:w-[600px] overflow-y-auto"
          >
            <SheetHeader>
              <SheetTitle>Edit Test Suite</SheetTitle>
            </SheetHeader>

            <div className="mt-6">
              <EditTestSuiteDialog
                testSuite={testSuite}
                testSuiteIndex={index}
                setupIndex={setupIndex}
              />
            </div>
          </SheetContent>
        </Sheet>

        <Button
          variant="destructive"
          onClick={() => removeSetupTestSuite(index)}
        >
          <Trash />
        </Button>
      </CardHeader>
    </Card>
  );
}
