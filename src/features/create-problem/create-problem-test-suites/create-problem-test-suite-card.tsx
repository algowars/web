import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

export default function CreateProblemTestSuiteCard() {
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
