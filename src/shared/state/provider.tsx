"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./store";
import { registerGameHubBridge } from "@/domains/game/state/game-hub-bridge";

export default function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore | null>(null);
  // eslint-disable-next-line react-hooks/refs
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Client Components still render once on the server for the initial HTML pass, and
  // @microsoft/signalr can only run in a real browser (it dynamically requires browser-only
  // globals to pick a transport). useEffect guarantees this only ever fires after mount, i.e.
  // in the browser.
  useEffect(() => {
    registerGameHubBridge(storeRef.current!.dispatch);
  }, []);

  // eslint-disable-next-line react-hooks/refs
  return <Provider store={storeRef.current}>{children}</Provider>;
}
