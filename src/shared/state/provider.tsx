"use client";

/* eslint-disable react-hooks/refs */

import { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./store";
import { registerGameHubBridge } from "@/domains/game/state/game-hub-bridge";

export default function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    registerGameHubBridge(storeRef.current.dispatch);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
