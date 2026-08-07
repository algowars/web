"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/shared/router-config";

export default function Forbidden() {
  const router = useRouter();

  return (
    <SidebarLayout breadcrumbs={[]}>
      <div className="px-2 md:px-4 pb-2 md:pb-4">
        <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="mb-2 inline-flex size-10 items-center justify-center rounded-full bg-muted">
                <ShieldAlert className="size-5 text-muted-foreground" />
              </div>
              <CardTitle>Access denied</CardTitle>
              <CardDescription>
                You do not have permission to view this page.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you think this is a mistake, contact the owner of this
                resource or return home.
              </p>
            </CardContent>

            <CardFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Go back
              </Button>
              <Button asChild>
                <Link href={routerConfig.home.path}>Go home</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </SidebarLayout>
  );
}
