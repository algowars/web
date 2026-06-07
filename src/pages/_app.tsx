import type { AppProps } from "next/app";

import AppProviders from "@/pages/app-providers";

import "@/app/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}
