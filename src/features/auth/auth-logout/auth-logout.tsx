"use client";

import React from "react";
import { routerConfig } from "@/router-config";

export default function AuthLogout(props: React.ComponentProps<"a">) {
  return <a {...props} href={routerConfig.authLogOut.path} />;
}
