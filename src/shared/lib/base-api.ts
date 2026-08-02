import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { env } from "@/env";

const REQUEST_TIMEOUT_MS = 15_000;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_API_SERVER_URL,

  prepareHeaders: async (headers) => {
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
    } catch {}

    headers.set("Content-Type", "application/json");
    return headers;
  },
});

/**
 * Wraps fetchBaseQuery with a hard timeout.
 *
 * Without this, a request that hangs (dropped connection, backend cold
 * start, etc.) never resolves or rejects — any code awaiting it (e.g. the
 * run/submit listener effects) never reaches its `finally` block, so
 * `isSubmittingSubmission` stays `true` forever and the UI gets stuck on
 * "Submitting...". This guarantees every request settles within
 * REQUEST_TIMEOUT_MS, one way or another.
 */
const baseQueryWithTimeout: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const controller = new AbortController();

  // If the caller already gave us a signal (e.g. a manually-aborted
  // request), respect it and abort ours too.
  const externalSignal = api.signal;
  const onExternalAbort = () => controller.abort();
  externalSignal.addEventListener("abort", onExternalAbort);

  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const result = await rawBaseQuery(
      args,
      { ...api, signal: controller.signal },
      extraOptions
    );

    // fetchBaseQuery resolves with { error } on an abort rather than
    // throwing, so a timed-out request shows up here, not in a catch block.
    if (timedOut && result.error) {
      return {
        error: {
          status: "TIMEOUT_ERROR",
          error: `Request timed out after ${REQUEST_TIMEOUT_MS}ms`,
        } as FetchBaseQueryError,
      };
    }

    return result;
  } finally {
    clearTimeout(timeoutId);
    externalSignal.removeEventListener("abort", onExternalAbort);
  }
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithTimeout,
  tagTypes: [
    "Game",
    "GameAvailable",
    "ActiveGame",
    "ActiveLobby",
    "Health",
    "Order",
    "Product",
    "Problem",
    "Submission",
    "User",
  ],
  endpoints: () => ({}),
});
