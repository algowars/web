import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProblemStore } from "../create-problem-store";
import { CreateProblemTestSuiteModel } from "../models/create-problem-test-suite-model";

type EditTestSuiteDialogProps = {
  testSuite: CreateProblemTestSuiteModel;
  testSuiteIndex: number;
  setupIndex: number;
};

export function EditTestSuiteDialog({
  testSuite,
  testSuiteIndex,
  setupIndex,
}: EditTestSuiteDialogProps) {
  const addTestCase = useCreateProblemStore(
    (s) => s.addTestCaseToSetupTestSuite
  );
  const removeTestCase = useCreateProblemStore(
    (s) => s.removeTestCaseToSetupTestSuite
  );
  const updateTestCase = useCreateProblemStore((s) => s.updateSetupTestCase);
  const getTestCases = useCreateProblemStore(
    (s) => s.getTestCasesBySetupTestSuiteIndex
  );

  const testCases = getTestCases(setupIndex, testSuiteIndex);

  return (
    <div className="space-y-6 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{testSuite.type}</h2>

        <Button
          variant="secondary"
          onClick={() =>
            addTestCase(setupIndex, testSuiteIndex, {
              input: "",
              expectedOutput: "",
            })
          }
        >
          Add Test Case
        </Button>
      </div>

      <div className="space-y-4">
        {testCases.map((testCase, testCaseIndex) => (
          <div key={testCaseIndex} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Test Case {testCaseIndex + 1}</h3>

              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  removeTestCase(setupIndex, testSuiteIndex, testCaseIndex)
                }
              >
                Remove
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Input</Label>
              <Input
                value={testCase.input}
                onChange={(e) =>
                  updateTestCase(setupIndex, testSuiteIndex, testCaseIndex, {
                    input: e.target.value,
                    expectedOutput: testCase.expectedOutput,
                  })
                }
                placeholder="Enter input JSON, text, or value"
              />
            </div>

            <div className="space-y-2">
              <Label>Expected Output</Label>
              <Input
                value={testCase.expectedOutput}
                onChange={(e) =>
                  updateTestCase(setupIndex, testSuiteIndex, testCaseIndex, {
                    input: testCase.input,
                    expectedOutput: e.target.value,
                  })
                }
                placeholder="Enter expected output"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
