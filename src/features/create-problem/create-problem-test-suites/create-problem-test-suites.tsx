"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import CreateProblemTestSuitesForm from "./create-problem-test-suites-form";
import { getAvailableLanguages } from "@/features/problems/api/get-available-languages";
import { useCreateProblemContext } from "../create-problem-context";

type CreateProblemTestSuite = {
  id: string;
  languageId: number;
  languageName: string;
  versionId: number;
  versionName: string;
};

export default function CreateProblemTestSuites() {
  const [isOpen, setIsOpen] = useState(false);
  const { availableLanguages } = useCreateProblemContext();

  const handleAddTestSuite = () => {
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Problem Setups</CardTitle>
            <CardDescription>
              Language Support, Test Suites, and test cases
            </CardDescription>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Setup
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create Test Suite</SheetTitle>
                <SheetDescription>
                  Select a language and version to create a new test suite.
                </SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <CreateProblemTestSuitesForm onSubmit={handleAddTestSuite} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent>
        {/* {testSuites.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No test suites created yet. Click &quot;Add Setup&quot; to get
            started.
          </div>
        ) : (
          <div className="space-y-4">
            {testSuites.map((suite) => (
              <Card key={suite.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{suite.languageName}</h4>
                    <p className="text-sm text-muted-foreground">
                      Version: {suite.versionName}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </Card>
            ))} */}
        {/* </div> */}
        {/* )} */}
      </CardContent>
    </Card>
  );
}
