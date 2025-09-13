import React from "react";
import { AdminProblemProvider } from "./admin-problem-context";
import AdminProblemHeader from "./admin-problem-header/admin-problem-header";

type AdminProblemProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminProblem({ params }: AdminProblemProps) {
  const slug = (await params).slug;

  return (
    <AdminProblemProvider slug={slug}>
      <div className="grid grid-cols-12">
        <div className="col-span-6">
          <AdminProblemHeader />
        </div>
      </div>
    </AdminProblemProvider>
  );
}
