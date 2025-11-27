import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CreateProblemProvider } from "@/features/create-problem/create-problem-context";
import CreateProblemDetails from "@/features/create-problem/create-problem-details/create-problem-details";
import CreateProblemTestSuites from "@/features/create-problem/create-problem-test-suites/create-problem-test-suites";
import { routerConfig } from "@/router-config";
import React from "react";

export default function ProblemsCreatePage() {
  return (
    <SidebarLayout
      breadcrumbs={[
        {
          url: routerConfig.home.path,
          name: "Home",
        },
        {
          url: routerConfig.problemManagement.path,
          name: "Problem Management",
        },
        {
          url: routerConfig.createProblem.path,
          name: "Create",
        },
      ]}
      defaultOpen={true}
    >
      <CreateProblemProvider>
        <div className="h-full flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Problem</CardTitle>
              <CardDescription>Title, questions, and tags</CardDescription>
            </CardHeader>
          </Card>
          <CreateProblemDetails />
          <CreateProblemTestSuites />
        </div>
      </CreateProblemProvider>
    </SidebarLayout>
  );
}
