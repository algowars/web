"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

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

export default function NotFound() {
  const router = useRouter();

  return (
    <SidebarLayout breadcrumbs={[]}>
      <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="mb-2 inline-flex size-10 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="size-5 text-muted-foreground" />
            </div>
            <CardTitle>Problem not found</CardTitle>
            <CardDescription>
              We could not find the problem you are looking for. It may have
              been removed, renamed, or the link is incorrect.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Try going back to where you came from, or return home.
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
    </SidebarLayout>
  );
}
