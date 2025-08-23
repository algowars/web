"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useAdminProblems } from "../api/get-admin-problems";
import { adminColumns } from "./admin-problems-column";
import { useAuth0 } from "@auth0/auth0-react";
import { routerConfig } from "@/router-config";

export default function AdminProblemsTable() {
  const [timestamp] = useState(new Date());
  const { getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  React.useEffect(() => {
    async function fetchToken() {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
      } catch {
        setAccessToken(null);
      }
    }
    fetchToken();
  }, [getAccessTokenSilently]);

  const { data } = useAdminProblems({
    page: 1,
    size: 25,
    timestamp,
    accessToken: accessToken ?? "",
  });

  return (
    <DataTable
      data={data?.results ?? []}
      pagination={{ pageIndex: data?.page ?? 1, pageSize: data?.size ?? 25 }}
      columns={adminColumns}
      getRowUrl={(row) => routerConfig.adminProblem.execute({ slug: row.slug })}
    />
  );
}
