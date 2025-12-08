"use client";

import { useProblemEditorStore } from "../problem-editor-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function ProblemTestCases() {
  const getTestSuites = useProblemEditorStore((s) => s.getTestSuites);
  const testCases = getTestSuites().flatMap((suite) => suite.testCases);

  if (testCases.length === 0) {
    return <div>No test cases available</div>;
  }

  return (
    <Tabs defaultValue="0" className="w-full overflow-auto">
      <TabsList className="bg-card">
        {testCases.map((_, index) => (
          <TabsTrigger key={index} value={String(index)}>
            Test Case {index + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      {testCases.map((testCase, index) => (
        <TabsContent key={index} value={String(index)}>
          <div className="space-y-4 p-4">
            <div>
              <label className="block text-sm font-medium mb-2">Input</label>
              <Input
                type="text"
                defaultValue={testCase.input}
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Expected Output
              </label>
              <Input
                type="text"
                defaultValue={testCase.expectedOutput}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
