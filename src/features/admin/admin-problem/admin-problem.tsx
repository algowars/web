import React from "react";
import { AdminProblemProvider } from "./admin-problem-context";
import AdminProblemHeader from "./admin-problem-header/admin-problem-header";
import AdminProblemTabs from "./admin-problem-tabs/admin-problem-tags";

type AdminProblemProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminProblem({ params }: AdminProblemProps) {
  const slug = (await params).slug;
  return (
    <AdminProblemProvider slug={slug}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <AdminProblemHeader />
        </div>
        <div className="col-span-12">
          <AdminProblemTabs />
        </div>
      </div>
    </AdminProblemProvider>
  );
}
