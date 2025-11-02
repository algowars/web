import { Permissions } from "@/features/auth/permissions/Permissions";
import React from "react";

export type HasPermissionMode = "any" | "all";

function hasRequiredPermissions(
  userPermissions: Permissions[] | undefined = [],
  required: Permissions[],
  mode?: HasPermissionMode
) {
  if (!required.length) {
    return true;
  }

  const set = new Set(userPermissions);

  if (mode === "all") {
    return required.every((r) => set.has(r));
  }

  return required.some((r) => set.has(r));
}

export function useHasPermissions(
  userPermissions: Permissions[] | undefined,
  required: Permissions[],
  mode?: HasPermissionMode
) {
  return React.useMemo(
    () => hasRequiredPermissions(userPermissions, required, mode),
    [userPermissions?.join(","), required.join(","), mode]
  );
}
