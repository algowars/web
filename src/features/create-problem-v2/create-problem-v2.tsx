"use client";

import { useEffect } from "react";
import { Language } from "../problems/models/language";
import { useCreateProblemStore } from "./create-problem-store";
import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import CreateProblemMetadata from "./create-problem-metadata";

type CreateProblemV2Props = {
  availableLanguages: Language[];
};

export default function CreateProblemV2({
  availableLanguages,
}: CreateProblemV2Props) {
  const setAvailableLanguages = useCreateProblemStore(
    (s) => s.setAvailableLanguages
  );

  useEffect(() => {
    if (availableLanguages.length) {
      setAvailableLanguages(availableLanguages);
    }
  }, [availableLanguages?.length]);

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
    >
      <CreateProblemMetadata />
    </SidebarLayout>
  );
}
