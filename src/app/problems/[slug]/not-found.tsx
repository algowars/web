import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideAlertCircle } from "lucide-react";
import { routerConfig } from "@/router-config";
import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";

export default function NotFound() {
  return (
    <SidebarLayout
      breadcrumbs={[
        { url: routerConfig.home.path, name: "Home" },
        { url: routerConfig.problems.path, name: "Problems" },
      ]}
    >
      <div className="flex flex-col items-center justify-center h-full gap-4 py-24 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-destructive/10">
          <LucideAlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Problem not found</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            The problem may have been removed or the link may be incorrect.
          </p>
        </div>
        <Link
          href={routerConfig.problems.path}
          className={buttonVariants({ variant: "outline" })}
        >
          Browse Problems
        </Link>
      </div>
    </SidebarLayout>
  );
}
