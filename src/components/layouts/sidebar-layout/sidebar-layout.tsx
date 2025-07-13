import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import AppSidebar from "./app-sidebar/app-sidebar";
import AppSidebarHeader, {
  BreadcrumbItem,
} from "./app-sidebar/app-sidebar-header";

type SidebarProps = {
  breadcrumbs: BreadcrumbItem[];
  children?: ReactNode;
};

export default function SidebarLayout({ breadcrumbs, children }: SidebarProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        <div className="px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
