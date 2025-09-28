import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import React from "react";

export default function CreateProblemTestSuitesList() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Problem Setups</CardTitle>
          <CardDescription>
            Language Support, Test Suites, and test cases
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
