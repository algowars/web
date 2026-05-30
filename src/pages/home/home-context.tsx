import Dashboard from "@/features/dashboard/dashboard";
import Landing from "@/features/landing/landing";
import { auth0 } from "@/shared/lib/auth0";

export default async function HomeContext() {
  const session = await auth0.getSession();
  if (session?.user) {
    return <Dashboard />;
  }

  return <Landing />;
}
