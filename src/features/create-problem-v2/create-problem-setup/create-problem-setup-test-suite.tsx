import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateProblemSetupTestSuiteSheet from "./create-problem-setup-test-suite-sheet";
import { useCreateProblemStore } from "../create-problem-store";

type CreateProblemSetupTestSuiteProps = {
  setupIndex: number;
};

export default function CreateProblemSetupTestSuite({
  setupIndex,
}: CreateProblemSetupTestSuiteProps) {
  const getTestSuitesBySetupIndex = useCreateProblemStore(
    (s) => s.getTestSuitesBySetupIndex
  );
  const testSuites = getTestSuitesBySetupIndex(setupIndex);
  return (
    <Card>
      <CardHeader className="flex gap-3">
        <div className="flex flex-col gap-3">
          <CardTitle>Test Suites</CardTitle>
          <CardDescription>
            A minimum of 2 test suite is required. Public and Private
          </CardDescription>
        </div>
        <CreateProblemSetupTestSuiteSheet buttonClassName="ml-auto mt-1" />
      </CardHeader>
      <CardContent>{JSON.stringify(testSuites)}</CardContent>
    </Card>
  );
}
