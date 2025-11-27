import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import AppSidebar from "./app-sidebar/app-sidebar";
import AppSidebarHeader, {
  BreadcrumbItem,
} from "./app-sidebar/app-sidebar-header";

type SidebarProps = {
  breadcrumbs: BreadcrumbItem[];
  children?: ReactNode;
  defaultOpen?: boolean;
  headerItems?: React.ReactNode;
};

export default function SidebarLayout({
  breadcrumbs,
  children,
  defaultOpen,
  headerItems,
}: SidebarProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <AppSidebarHeader breadcrumbs={breadcrumbs} headerItems={headerItems} />
        <div className="px-4 pb-4 h-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
