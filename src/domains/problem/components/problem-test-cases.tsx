"use client";

import { Badge } from "@/shared/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { PublicTestCase } from "../models/problem";

type ProblemTestCasesProps = {
  testCases: PublicTestCase[];
};

export default function ProblemTestCases({
  testCases,
}: Readonly<ProblemTestCasesProps>) {
  if (testCases.length === 0) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center p-4 text-sm text-muted-foreground">
        No public test cases available.
      </div>
    );
  }

  return (
    <Tabs
      defaultValue="case-0"
      className="flex h-full min-h-0 flex-col p-4"
      aria-label="Public test cases"
    >
      <div className="overflow-x-auto pb-1">
        <TabsList>
          {testCases.map((testCase, index) => (
            <TabsTrigger
              key={`${testCase.name}-${index}`}
              value={`case-${index}`}
              className="mr-2 shrink-0"
            >
              Case {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {testCases.map((testCase, index) => (
        <TabsContent
          key={`${testCase.name}-panel-${index}`}
          value={`case-${index}`}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <section className="space-y-3 w-full">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold">{testCase.name}</h3>
              <Badge variant="secondary">Case {index + 1}</Badge>
            </div>

            {testCase.description ? (
              <p className="text-sm text-muted-foreground">
                {testCase.description}
              </p>
            ) : null}

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Inputs</h4>
              <div className="space-y-2">
                {testCase.inputs.length > 0 ? (
                  testCase.inputs.map((input, inputIndex) => (
                    <div
                      key={`${input.valueType}-${inputIndex}`}
                      className="rounded-md border bg-background p-3"
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Input {inputIndex + 1} ({input.valueType})
                      </p>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-sm">
                        {input.value}
                      </pre>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No inputs provided.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Expected Output</h4>
              <div className="space-y-2">
                {testCase.expectedOutputs.length > 0 ? (
                  testCase.expectedOutputs.map((output, outputIndex) => (
                    <div
                      key={`${output.valueType}-${outputIndex}`}
                      className="rounded-md border bg-background p-3"
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Output {outputIndex + 1} ({output.valueType})
                      </p>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-sm">
                        {output.value}
                      </pre>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No expected outputs provided.
                  </p>
                )}
              </div>
            </div>
          </section>
        </TabsContent>
      ))}
    </Tabs>
  );
}
