"use client";

import React from "react";
import { routerConfig } from "@/router-config";

export default function AuthSignupButton(props: React.ComponentProps<"a">) {
  return <a {...props} href={routerConfig.authSignUp.path} />;
}
