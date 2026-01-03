import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { LucideAlertCircle } from "lucide-react";
import { routerConfig } from "@/router-config";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md mx-4 shadow-md border border-border text-center py-10">
        <CardHeader className="flex flex-col items-center space-y-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-destructive/10">
            <LucideAlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Page not found
          </CardTitle>
          <CardDescription>
            We couldn’t find the page you were looking for.
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4 flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground max-w-sm">
            The link may be broken or the page may have been removed.
          </p>
          <div className="flex gap-3 mt-4">
            <Link
              href={routerConfig.home.path}
              className={buttonVariants({ variant: "default" })}
            >
              Return Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
