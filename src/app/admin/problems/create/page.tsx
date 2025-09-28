import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateProblemProvider } from "@/features/create-problem/create-problem-context";
import CreateProblemDetails from "@/features/create-problem/create-problem-details/create-problem-details";
import CreateProblemTestSuites from "@/features/create-problem/create-problem-test-suites/create-problem-test-suites";
import CreateProblemTestSuitesList from "@/features/create-problem/create-problem-test-suites/create-problem-test-suties-list";
import { routerConfig } from "@/router-config";
import React from "react";

export default function AdminProblemCreatePage() {
  return (
    <SidebarLayout
      breadcrumbs={[
        {
          url: routerConfig.home.path,
          name: "Home",
        },
        {
          url: routerConfig.admin.path,
          name: "Admin",
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
