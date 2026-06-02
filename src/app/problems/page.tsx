import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import Link from "next/link";

export default function ProblemsPage() {
  return (
    <SidebarLayout breadcrumbs={[]}>
      <h1>HELLO WORLD</h1>
      <Link href="/account/setup">Account Setup</Link>
    </SidebarLayout>
  );
}
