"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useAdminProblems } from "../api/get-admin-problems";
import { adminColumns } from "./admin-problems-column";
import { routerConfig } from "@/router-config";
import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useAccount } from "@/features/auth/account.context";

export default function AdminProblemsTable() {
  const [timestamp] = useState(new Date());
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { isAuthenticated } = useAccount();

  React.useEffect(() => {
    async function fetchToken() {
      try {
        if (isAuthenticated) {
          const token = await getAccessToken();
          setAccessToken(token);
        }
      } catch {
        setAccessToken(null);
      }
    }
    fetchToken();
  }, [getAccessToken, isAuthenticated]);

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
