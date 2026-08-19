"use client";

import UserSetupForm from "@/domains/user/forms/user-setup-form";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Layout from "@/shared/layouts/layout/layout";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

function SetupFormSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading setup form">
      <div className="space-y-3">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>

      <Skeleton className="h-9 w-28" />
    </div>
  );
}

function renderFallback(props: FallbackProps) {
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-muted-foreground">
        {props.error instanceof Error
          ? props.error.message
          : "Couldn't load your account."}
      </p>
      <Button onClick={props.resetErrorBoundary}>Try again</Button>
    </div>
  );
}

export default function UserSetupLayout() {
  return (
    <Layout mainClassName="flex justify-center items-center py-9 px-2">
      <Card className="max-w-lg w-full">
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} fallbackRender={renderFallback}>
                <Suspense fallback={<SetupFormSkeleton />}>
                  <UserSetupForm />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </Layout>
  );
}
