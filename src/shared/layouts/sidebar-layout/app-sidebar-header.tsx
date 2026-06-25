import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { ModeToggle } from "@/shared/theme/mode-toggle";
import Link from "next/link";
import React from "react";

export type BreadcrumbItem = {
  name: string;
  url?: string;
};

interface AppSidebarHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  headerItems?: React.ReactNode;
}

export default function AppSidebarHeader({
  breadcrumbs = [],
  headerItems,
}: AppSidebarHeaderProps) {
  return (
    <header className="flex min-h-16 shrink-0 items-center gap-2 py-2">
      <div className="flex items-center gap-2 px-2 md:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
        />
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem
                      className={index === 0 ? "hidden md:block" : ""}
                    >
                      {isLast || !breadcrumb.url ? (
                        <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={breadcrumb.url}>{breadcrumb.name}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator
                        className={index === 0 ? "hidden md:block" : ""}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      {headerItems}
      <ModeToggle className="ml-auto mr-3" />
    </header>
  );
}
