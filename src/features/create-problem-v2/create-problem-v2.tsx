"use client";

import { useEffect } from "react";
import { Language } from "../problems/models/language";
import { useCreateProblemStore } from "./create-problem-store";
import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import CreateProblemMetadata from "./create-problem-metadata";
import CreateProblemQuestion from "./create-problem-question";
import { CreateProblemSetup } from "./create-problem-setup/create-problem-setup";
import CreateProblemFooter from "./create-problem-footer";

type CreateProblemV2Props = {
  availableLanguages: Language[];
  accessToken?: string;
};

export default function CreateProblemV2({
  availableLanguages,
  accessToken,
}: CreateProblemV2Props) {
  const setAvailableLanguages = useCreateProblemStore(
    (s) => s.setAvailableLanguages
  );

  useEffect(() => {
    if (availableLanguages.length) {
      setAvailableLanguages(availableLanguages);
    }
  }, [availableLanguages, availableLanguages.length, setAvailableLanguages]);

  return (
    <SidebarLayout
      breadcrumbs={[
        {
          url: routerConfig.home.path,
          name: "Home",
        },
        {
          url: routerConfig.problemManagement.path,
          name: "Problems",
        },
        {
          url: routerConfig.createProblem.path,
          name: "Create",
        },
      ]}
      className="flex flex-col gap-3"
    >
      <CreateProblemMetadata />
      <CreateProblemQuestion />
      <CreateProblemSetup />
      <CreateProblemFooter accessToken={accessToken} />
    </SidebarLayout>
  );
}
