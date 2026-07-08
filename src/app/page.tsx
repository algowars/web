import DashboardLayout from "@/pages/dashboard/dashboard-layout";
import Hero from "@/pages/landing/hero";
import Layout from "@/shared/layouts/layout/layout";
import { auth0 } from "@/shared/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  if (session) {
    return <DashboardLayout />;
  }

  return (
    <Layout>
      <Hero />
    </Layout>
  );
}
