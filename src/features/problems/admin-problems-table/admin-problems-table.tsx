"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useAdminProblems } from "../api/get-admin-problems";
import { adminColumns } from "./admin-problems-column";
import { useAuth0 } from "@auth0/auth0-react";
import { routerConfig } from "@/router-config";
import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { problemColumnsV2 } from "../problems-table-v2/problems-columns-v2";

export default function AdminProblemsTable() {
  const { getAccessTokenSilently } = useAuth0();
  const [timestamp] = useState(new Date());
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

  const { data, isFetching } = useAdminProblems({
    pagination,
    timestamp,
    accessToken: accessToken ?? "",
  });

  return (
    <DataTable
      data={data?.results ?? []}
      rowCount={data?.total ?? 0}
      pagination={pagination}
      setPagination={setPagination}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
      columns={adminColumns}
      isLoading={isFetching}
      manual
      getRowUrl={(row) => routerConfig.adminProblem.execute({ slug: row.slug })}
    />
  );
}
