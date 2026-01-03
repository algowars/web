import CreateProblemV2 from "@/features/create-problem-v2/create-problem-v2";
import { getAvailableLanguages } from "@/features/problems/api/get-available-languages";
import { auth0 } from "@/lib/auth0";
import React from "react";

export default async function ProblemsCreatePage() {
  const accessToken = await auth0.getAccessToken();

  const languages = await getAvailableLanguages(accessToken?.token ?? "");

  return (
    <CreateProblemV2
      availableLanguages={languages ?? []}
      accessToken={accessToken.token}
    />
  );
}
