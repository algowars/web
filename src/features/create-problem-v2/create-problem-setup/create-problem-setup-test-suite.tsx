import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateProblemSetupTestSuiteSheet from "./create-problem-setup-test-suite-sheet";
import { useCreateProblemStore } from "../create-problem-store";
import CreateProblemTestSuiteCard from "./create-problem-test-suite-card";

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
          <CardTitle>Test Suite Management</CardTitle>
          <CardDescription>
            A minimum of 2 test suite is required. Public and Private
          </CardDescription>
        </div>
        <CreateProblemSetupTestSuiteSheet buttonClassName="ml-auto mt-1" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3>Test Suites</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Manage the test suites for this setup. Each test suite contains
            multiple test cases to evaluate the correctness of solutions.
          </p>
          <ul className="flex flex-col gap-3">
            {testSuites.map((testSuite, index) => (
              <li key={index}>
                <CreateProblemTestSuiteCard
                  testSuite={testSuite}
                  setupIndex={setupIndex}
                  index={index}
                />
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
