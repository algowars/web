import AuthCallback from "@/features/auth/auth-callback/auth-callback";
import { auth0 } from "@/lib/auth0";
import { routerConfig } from "@/router-config";
import { redirect } from "next/navigation";

export default async function AccountCallbackPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect(routerConfig.home.path);
  }

  return <AuthCallback />;
}
