"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  src,
  fallbackSrc,
  onLoadingStatusChange,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image> & {
  fallbackSrc?: string;
}) {
  const [resolvedSrc, setResolvedSrc] = React.useState(src ?? fallbackSrc);

  React.useEffect(() => {
    setResolvedSrc(src ?? fallbackSrc);
  }, [src, fallbackSrc]);

  if (!resolvedSrc) {
    return null;
  }

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      src={resolvedSrc}
      onLoadingStatusChange={(status) => {
        onLoadingStatusChange?.(status);
        if (status === "error" && fallbackSrc && resolvedSrc !== fallbackSrc) {
          setResolvedSrc(fallbackSrc);
        }
      }}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
