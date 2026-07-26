"use client";

import { useAppDispatch } from "@/shared/state/hooks";
import { useEffect } from "react";
import { HealthEvents } from "../state/health-events";

export default function HealthCheck() {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(HealthEvents.loadHealthRequested());
  }, [appDispatch]);

  return null;
}
