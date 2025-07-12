import { cn } from "@/lib/utils";
import React from "react";

interface PageLoaderProps {
  className?: string;
  message?: string;
}

export default function PageLoader({ className, message }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-muted"></div>
          <div className="absolute top-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>

        {message ? (
          <p className="text-sm text-muted-foreground animate-pulse">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
