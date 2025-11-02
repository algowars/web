import { Permissions } from "@/features/auth/permissions/Permissions";
import PermissionsGuard from "@/features/auth/permissions/permissions.guard";
import { auth0 } from "@/lib/auth0";
import { routerConfig } from "@/router-config";
import { redirect } from "next/navigation";

export default async function ProblemsManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();

  if (!session) {
    redirect(routerConfig.home.path);
  }

  return (
    <PermissionsGuard permissions={[Permissions.ReadProblem]}>
      {children}
    </PermissionsGuard>
  );
}
