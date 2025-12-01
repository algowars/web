import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import CreateProblemV2 from "@/features/create-problem-v2/create-problem-v2";
import { CreateProblemProvider } from "@/features/create-problem/create-problem-context";
import CreateProblemDetails from "@/features/create-problem/create-problem-details/create-problem-details";
import CreateProblemTestSuites from "@/features/create-problem/create-problem-test-suites/create-problem-test-suites";
import { getAvailableLanguages } from "@/features/problems/api/get-available-languages";
import { auth0 } from "@/lib/auth0";
import { routerConfig } from "@/router-config";
import React from "react";

export default async function ProblemsCreatePage() {
  const accessToken = await auth0.getAccessToken();

  const languages = await getAvailableLanguages(accessToken?.token ?? "");

  return <CreateProblemV2 availableLanguages={languages ?? []} />;
}
